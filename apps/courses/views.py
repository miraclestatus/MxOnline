from pure_pagination import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render
from django.views.generic.base import View
from apps.courses.models import Course
from apps.operations.models import UserFavorite, UserCourse
from apps.courses.models import Video, CourseResource
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.
class CourseListView(View):
    def get(self, request, *args, **kwargs):
        """获取课程列表信息"""
        all_courses = Course.objects.order_by("-add_time")
        ## 获取热门课程 前3个
        hot_courses = Course.objects.order_by("-click_nums")[:3]

        sort = request.GET.get('sort', "")
        if sort == 'students':
            # 根据参与人数排序  减号代表倒序排序的意思
            # li><a href="?sort=students">参与人数</a></li>
            all_courses = all_courses.order_by('-students')
        elif sort == 'hot':
            # 课程排序  <li><a href="?sort=hot">最热门</a></li>
            # 根据最热门进行排序 参与人数  <
            all_courses = all_courses.order_by('-click_nums')

        # 对课程机构进行分页
        try:
            page = request.GET.get('page', 1)
        except PageNotAnInteger:
            page = 1
        p = Paginator(all_courses,per_page=5, request=request) # 每页显示多少个
        courses = p.page(page)

        return render(request, 'course-list.html',
                      {"all_courses":courses,
                       "sort":sort,
                       "hot_courses":hot_courses,
                       })

class CourseDetailView(View):

    def get(self, request, course_id, *args, **kwargs):
        """
        获取课程详情页
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        # 根据id查询课程
        course = Course.objects.get(id=int(course_id))
        # 点击到课程 的详情就记录一次点击数
        course.click_nums += 1
        course.save()
        # 获取收藏状态
        has_fav_course = False
        has_fav_org = False
        if request.user.is_authenticated:
            # 查询用户是否收藏了该课程和机构 fav_type=1证明是课程收藏，如果有，证明用户收藏了这个课
            if UserFavorite.objects.filter(user=request.user, fav_id=course.id, fav_type=1):
                has_fav_course = True
            if UserFavorite.objects.filter(user=request.user, fav_id=course.id, fav_type=2):
                has_fav_org = True

        #课程推荐
        #通过课程的单标签进行课程推荐

        tag = course.tag
        related_courses = []
        if tag:
            related_courses = Course.objects.filter(tag=tag).exclude(id__in=[course.id])[:3]
            print(related_courses)

        return render(request, 'course-detail.html',
                      {"course":course,
                       "has_fav_course":has_fav_course,
                       "has_fav_org":has_fav_org,
                       "related_courses":related_courses
                    })

class CouersLessonView(LoginRequiredMixin,View):
    """
    章节信息
    """
    login_url = '/login/'
    def get(self, request, course_id, *args, **kwargs):
        course = Course.objects.get(id=int(course_id))
        # 点击到课程 的详情就记录一次点击数
        course.click_nums += 1
        course.save()

        #该课的同学还学过
        # 查询当前用户都学了那些课
        user_courses = UserCourse.objects.filter(course=course)
        user_ids = [user_course.user.id for user_course in user_courses]
        print(user_ids)
        # 查询这个用户关联的所有课程
        all_courses = UserCourse.objects.filter(user_id__in=user_ids).order_by("-course__click_nums")[:5]
        # 过滤掉当前课程
        related_courses = []
        for item in all_courses:
            if item.course.id != course.id:
                related_courses.append(item.course)

        # 查询资料信息
        course_resource = CourseResource.objects.filter(course=course)
        return render(request, 'course-video.html',
                      {"course": course,
                       "course_resource":course_resource,
                       "related_courses":related_courses,
                       })