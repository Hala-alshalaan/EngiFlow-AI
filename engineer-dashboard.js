// 1. حماية الصفحة (Route Guard) - التحقق من الجلسة وصلاحيات المكتب الهندسي
document.addEventListener("DOMContentLoaded", () => {
    // محاولة قراءة بيانات المستخدم من الـ LocalStorage (تدعم الطريقتين لضمان عدم حدوث خطأ)
    const currentUser = JSON.parse(localStorage.getItem("engiflowCurrentUser") || "null");
    const userName = currentUser ? currentUser.name : localStorage.getItem("userName");
    const userRole = currentUser ? currentUser.account_type : localStorage.getItem("userRole");

    // إذا لم يسجل دخول أو كان حسابه ليس مكتباً هندسياً (office)، يتم توجيهه لصفحة الدخول
    if (!userName || userRole !== "office") {
        Swal.fire({
            icon: 'error',
            title: 'صلاحيات غير صالحة',
            text: 'يجب تسجيل الدخول بحساب مكتب هندسي للوصول إلى هذه الصفحة.',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#eab308',
            background: '#0f172a',
            color: '#ffffff'
        }).then(() => {
            window.location.replace("login.html");
        });
        return;
    }

    // عرض اسم المكتب الهندسي ديناميكياً في الـ Header
    const officeDisplay = document.getElementById("officeNameDisplay");
    if (officeDisplay) {
        officeDisplay.textContent = userName;
    }
});

// 2. زر تسجيل الخروج بتصميم احترافي (SweetAlert2)
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        Swal.fire({
            title: 'تسجيل الخروج',
            text: "هل أنت متأكد من إنهاء جلسة العمل للمكتب الهندسي؟",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#eab308',
            cancelButtonColor: '#1e293b',
            confirmButtonText: 'نعم، تسجيل الخروج',
            cancelButtonText: 'إلغاء',
            background: '#0f172a',
            color: '#ffffff'
        }).then((result) => {
            if (result.isConfirmed) {
                // مسح بيانات الجلسة فقط بدل clear لتجنب حذف أي إعدادات أخرى للمتصفح
                localStorage.removeItem("engiflowCurrentUser");
                localStorage.removeItem("userName");
                localStorage.removeItem("userRole");
                
                window.location.href = "login.html";
            }
        });
    });
}

// 3. معاينة المشروع (محدث ليعمل بطريقة تفاعلية واحترافية)
function reviewProject(projectId) {
    Swal.fire({
        title: `معاينة المشروع الهندسي ${projectId}`,
        html: `
            <div style="text-align: right; direction: rtl; color: #cbd5e1; font-size: 14px; line-height: 1.8;">
                <p>🚀 <strong>جارٍ تحميل بيئة الـ AI Workspace وتحليل مخططات الـ CAD...</strong></p>
                <p>يتم فحص المطابقة مع الأكواد الإنشائية وجدول الكميات (BOQ) بالتعاون مع محركات الذكاء الاصطناعي.</p>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'فتح لوحة التحكم الكاملة للمشروع',
        confirmButtonColor: '#eab308',
        background: '#0f172a',
        color: '#ffffff'
    });
}