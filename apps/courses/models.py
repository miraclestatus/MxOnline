from django.db import models


# Create your models here.
from apps.organizations.models import CourseOrg
from apps.users.models import BaseModel

class Course(BaseModel):
    course_org = models.ForeignKey(CourseOrg, null=True, blank=True, on_delete=models.CASCADE, verbose_name="课程机构")
    name = models.CharField(verbose_name="课程名", max_length=50)
    desc = models.CharField(verbose_name="课程描述", max_length=300)
    learn_times = models.IntegerField(default=0, verbose_name="学习时长（分钟数）")
    degree = models.CharField(verbose_name="难度", choices=(("cj","初级"),("zj","中级"),("gj","高级")),max_length=2)
    students = models.IntegerField(verbose_name="学习人数", default=0)
    fav_nums = models.IntegerField(verbose_name="收藏人数", default=0)
    click_nums = models.IntegerField(verbose_name="点击数", default=0)
    notice = models.CharField(verbose_name="课程公告", max_length=300, default="")
    category = models.CharField(verbose_name="课程类别", max_length=20, default="后端开发")
    tag = models.CharField(verbose_name="课程标签", max_length=10, default="")
    youneed_know = models.CharField(verbose_name="课程须知", max_length=300, default="")
    teacher_tell = models.CharField(verbose_name="老师告诉你", max_length=300, default="")
    is_classics = models.BooleanField(default=False,verbose_name="是否经典")
    is_banner = models.BooleanField(default=False,verbose_name="是否广告位")
    image = models.ImageField(upload_to="courses/%Y/%m", verbose_name="封面图", max_length=100)
    class Meta:
        verbose_name = "课程信息"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name

    def lesson_nums(self):
        """统计章节数"""
        return self.lesson_set.all().count()


class Lesson(BaseModel):
    # on_delete表示对应的外键数据 把被删除后， 当前数据怎么办
    course = models.ForeignKey(Course, verbose_name="课程", on_delete=models.CASCADE)
    name = models.CharField(max_length=100, verbose_name="章节名")
    learn_times = models.IntegerField(default=0, verbose_name="学习时长（分钟数）")

    class Meta:
        verbose_name = "课程章节"
        verbose_name_plural = verbose_name
    def __str__(self):
        return self.name



class Video(BaseModel):
    lesson = models.ForeignKey(Lesson,verbose_name="章节", on_delete=models.CASCADE)
    name = models.CharField(max_length=100, verbose_name="视频名")
    learn_times = models.IntegerField(default=0, verbose_name="学习时长（分钟数）")
    url = models.CharField(max_length=1000, verbose_name="访问地址")

    class Meta:
        verbose_name = "视频"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name

class CourseResource(BaseModel):
    course = models.ForeignKey(Course, verbose_name="课程", on_delete=models.CASCADE)
    name = models.CharField(max_length=100, verbose_name="名称")
    file = models.FileField(max_length=200, verbose_name="下载地址",upload_to="courses/resourse%Y/%m")

    class Meta:
        verbose_name = "课程资源"
        verbose_name_plural = verbose_name

    def __str__(self):
       return self.name

































