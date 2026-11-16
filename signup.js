const accountCards = document.querySelectorAll(".account-card");
const userForm = document.getElementById("userForm");
const officeForm = document.getElementById("officeForm");
const selectedType = document.getElementById("selectedAccountType");
const signupButton = document.getElementById("signupButton");

// 1. منطق اختيار نوع الحساب (التبديل بين العميل والمكتب الهندسي)
accountCards.forEach(card => {
    card.addEventListener("click", function() {
        accountCards.forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");
        const type = this.dataset.type;
        selectedType.value = type;

        // إظهار النموذج المناسب وإخفاء الآخر
        if (userForm) userForm.hidden = (type !== "user");
        if (officeForm) officeForm.hidden = (type !== "office");

        // تعطيل حقول النموذج غير النشط لضمان عدم إرسال بياناته
        if (userForm) {
            userForm.querySelectorAll("input").forEach(input => {
                input.disabled = (type !== "user");
            });
        }

        if (officeForm) {
            officeForm.querySelectorAll("input").forEach(input => {
                input.disabled = (type !== "office");
            });
        }

        if (signupButton) signupButton.hidden = false;
    });
});

// 2. إرسال البيانات إلى سيرفر FastAPI ومعالجة الردود
document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const accountType = selectedType.value;

    if (!accountType) {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'الرجاء اختيار نوع الحساب.',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#C6A36B',
            background: '#17283B',
            color: '#ffffff'
        });
        return;
    }

    if (!this.reportValidity()) {
        return;
    }

    // تجهيز البيانات لإرسالها للسيرفر
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    data.accountType = accountType;

    try {
        const response = await fetch("http://127.0.0.1:8000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // تنبيه نجاح احترافي متناسق مع هوية المنصة
            Swal.fire({
                icon: 'success',
                title: 'أهلاً بكِ في EngiFlow AI!',
                text: result.message || 'تم إنشاء الحساب وحفظه في قاعدة البيانات بنجاح 🚀',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#C6A36B',
                background: '#17283B',
                color: '#ffffff',
                timer: 2500,
                timerProgressBar: true
            }).then(() => {
                // تحويل المستخدم لصفحة تسجيل الدخول بعد النجاح
                window.location.href = "login.html";
            });
        } else {
            // تنبيه خطأ بتصميم فخم ومتناسق
            Swal.fire({
                icon: 'error',
                title: 'عذراً',
                text: result.detail || 'حدث خطأ أثناء التسجيل',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#ef4444',
                background: '#17283B',
                color: '#ffffff'
            });
        }
    } catch (error) {
        console.error("Error:", error);
        // تنبيه خطأ اتصال بالسيرفر
        Swal.fire({
            icon: 'error',
            title: 'خطأ في الاتصال',
            text: 'تعذر الاتصال بالسيرفر. تأكد أن السيرفر يعمل.',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#ef4444',
            background: '#17283B',
            color: '#ffffff'
        });
    }
});