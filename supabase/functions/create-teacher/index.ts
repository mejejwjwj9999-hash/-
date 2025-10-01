import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // التحقق من صلاحيات المستخدم الحالي
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('غير مصرح');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('غير مصرح');
    }

    // التحقق من أن المستخدم لديه صلاحيات admin
    const { data: adminRole, error: adminRoleError } = await supabaseAdmin
      .from('admin_user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (adminRoleError || !adminRole) {
      throw new Error('ليس لديك صلاحيات لإضافة معلمين');
    }

    const teacherData = await req.json();

    // التحقق من وجود المستخدم أولاً
    let userId: string;
    let isNewUser = false;

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === teacherData.email);

    if (existingUser) {
      console.log('المستخدم موجود بالفعل:', existingUser.id);
      userId = existingUser.id;
      
      // التحقق من وجود ملف معلم موجود
      const { data: existingProfile } = await supabaseAdmin
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingProfile) {
        throw new Error('هذا المعلم موجود بالفعل في النظام');
      }
    } else {
      // إنشاء مستخدم جديد
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: teacherData.email,
        password: 'Teacher123!',
        email_confirm: true,
        user_metadata: {
          first_name: teacherData.first_name,
          last_name: teacherData.last_name,
          role: 'teacher'
        }
      });

      if (authError) {
        console.error('خطأ في إنشاء المستخدم:', authError);
        throw new Error(`فشل إنشاء المستخدم: ${authError.message}`);
      }

      userId = authData.user.id;
      isNewUser = true;
      console.log('تم إنشاء مستخدم جديد:', userId);
    }

    // التحقق من teacher_id وتوليده تلقائياً إذا لزم الأمر
    let teacherId = teacherData.teacher_id;
    
    if (!teacherId) {
      // توليد teacher_id فريد
      const timestamp = Date.now().toString().slice(-8);
      teacherId = `TCH${timestamp}`;
    }

    // التحقق من عدم تكرار teacher_id
    const { data: existingTeacherId } = await supabaseAdmin
      .from('teacher_profiles')
      .select('id')
      .eq('teacher_id', teacherId)
      .single();

    if (existingTeacherId) {
      // توليد teacher_id جديد
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.floor(Math.random() * 1000);
      teacherId = `TCH${timestamp}${random}`;
      console.log('تم توليد teacher_id جديد:', teacherId);
    }

    // إضافة ملف المعلم
    const { error: profileError } = await supabaseAdmin
      .from('teacher_profiles')
      .insert([{
        user_id: userId,
        teacher_id: teacherId,
        first_name: teacherData.first_name,
        last_name: teacherData.last_name,
        email: teacherData.email,
        phone: teacherData.phone,
        department_id: teacherData.department_id,
        specialization: teacherData.specialization,
        qualifications: teacherData.qualifications,
        hire_date: teacherData.hire_date,
        position: teacherData.position,
        office_location: teacherData.office_location,
        office_hours: teacherData.office_hours,
        bio: teacherData.bio,
        profile_image_url: teacherData.profile_image_url,
        cv_file_url: teacherData.cv_file_url,
        cv_file_name: teacherData.cv_file_name,
        cv_uploaded_at: teacherData.cv_file_url ? new Date().toISOString() : null,
        is_active: true
      }]);

    if (profileError) {
      console.error('خطأ في إضافة ملف المعلم:', profileError);
      
      // إذا كان المستخدم جديد وفشل إنشاء الملف، احذف المستخدم
      if (isNewUser) {
        await supabaseAdmin.auth.admin.deleteUser(userId);
        console.log('تم حذف المستخدم بسبب فشل إنشاء الملف');
      }
      
      throw new Error(`فشل إنشاء ملف المعلم: ${profileError.message}`);
    }

    // إضافة دور المعلم
    const { error: userRoleError } = await supabaseAdmin
      .from('user_roles')
      .insert([{
        user_id: userId,
        role: 'staff'
      }]);

    if (userRoleError) {
      console.log('تحذير: فشل إضافة دور المعلم:', userRoleError.message);
      // لا نرمي خطأ هنا لأن الدور قد يكون موجوداً بالفعل
    }

    console.log('تم إضافة المعلم بنجاح');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: isNewUser 
          ? `تم إضافة المعلم بنجاح. كلمة المرور الافتراضية: Teacher123!`
          : 'تم ربط المعلم بالحساب الموجود بنجاح',
        userId: userId,
        teacherId: teacherId,
        isNewUser: isNewUser
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('خطأ في إضافة المعلم:', error);
    const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة المعلم';
    return new Response(
      JSON.stringify({ 
        error: errorMessage
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
