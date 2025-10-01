
-- 1) جعل الـ bucket خاص بملفات المقررات عامًا للقراءة
update storage.buckets
set public = true
where name = 'course-files';

-- 2) سياسات RLS على storage.objects
-- ملاحظة: القراءة ستكون متاحة للجميع بسبب (public = true)،
-- لكن نضيف سياسة قراءة صريحة لزيادة الوضوح (لا تضر).
create policy "Public read for course-files"
on storage.objects
for select
using (bucket_id = 'course-files');

-- السماح فقط للمشرفين بإضافة ملفات داخل bucket course-files
create policy "Admins can upload to course-files"
on storage.objects
for insert
with check (
  bucket_id = 'course-files'
  and is_admin(auth.uid())
);

-- السماح فقط للمشرفين بتحديث ملفات داخل bucket course-files
create policy "Admins can update course-files"
on storage.objects
for update
using (
  bucket_id = 'course-files'
  and is_admin(auth.uid())
);

-- السماح فقط للمشرفين بحذف ملفات داخل bucket course-files
create policy "Admins can delete course-files"
on storage.objects
for delete
using (
  bucket_id = 'course-files'
  and is_admin(auth.uid())
);
