-- إعطاء صلاحيات كاملة للطالب رقم 12377122
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- البحث عن معرف المستخدم للطالب رقم 12377122
    SELECT user_id INTO target_user_id 
    FROM student_profiles 
    WHERE student_id = '12377122'
    LIMIT 1;
    
    -- إذا تم العثور على المستخدم
    IF target_user_id IS NOT NULL THEN
        -- إضافة دور الأدمن
        INSERT INTO user_roles (user_id, role) 
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- إضافة دور الموظف
        INSERT INTO user_roles (user_id, role) 
        VALUES (target_user_id, 'staff')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'تم إعطاء صلاحيات كاملة للطالب رقم 12377122';
    ELSE
        RAISE NOTICE 'لم يتم العثور على الطالب رقم 12377122';
    END IF;
END $$;