// دالة إظهار رسالة الـ Toast (تنشئ نفسها تلقائياً ولا تحتاج لتعديل HTML)
function showToast(message, isSuccess = true) {
    let toast = document.getElementById("toast");
    
    // لو العنصر مش موجود، بنشئه وندرجه بالصفحة تلقائياً
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.style.cssText = `
            visibility: hidden;
            min-width: 280px;
            background-color: #17283B;
            color: #f8fafc;
            text-align: center;
            border-radius: 12px;
            border: 1px solid #C6A36B;
            padding: 16px;
            position: fixed;
            z-index: 9999;
            right: 30px;
            bottom: 30px;
            font-size: 14px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 0.4s, bottom 0.4s;
        `;
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<span style="color: ${isSuccess ? '#C6A36B' : '#ef4444'};">${isSuccess ? '✓ Success: ' : '✕ Error: '}</span> ${message}`;
    
    // إظهار الـ Toast
    toast.style.visibility = "visible";
    toast.style.opacity = "1";
    toast.style.bottom = "50px";

    // إخفاء الـ Toast بعد 3 ثواني
    setTimeout(function() {
        toast.style.opacity = "0";
        toast.style.visibility = "hidden";
        toast.style.bottom = "30px";
    }, 3000);
}

// كود تسجيل الدخول
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showToast("الرجاء إدخال البريد الإلكتروني وكلمة المرور.", false);
        return;
    }

    // تفعيل حالة التحميل على زر تسجيل الدخول
    const submitBtn = document.querySelector('.login-button');
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.innerHTML = '<span class="spinner"></span> جاري تسجيل الدخول...';
        submitBtn.disabled = true;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // حفظ بيانات المستخدم في الـ LocalStorage (متوافقة مع Backend)
            localStorage.setItem("engiflowCurrentUser", JSON.stringify(result));
            localStorage.setItem("userName", result.name);
            localStorage.setItem("userRole", result.account_type); // تم التصحيح هنا ليتطابق مع الـ FastAPI

            showToast(result.message || "تم تسجيل الدخول بنجاح! 🚀", true);

            setTimeout(() => {
                if (result.account_type === "office") {
                    window.location.href = "engineer-dashboard.html";
                } else {
                    window.location.href = "client-dashboard.html";
                }
            }, 1500);

        } else {
            showToast(result.detail || "خطأ في تسجيل الدخول", false);
            if (submitBtn) {
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
            }
        }
    } catch (error) {
        console.error("Error:", error);
        showToast("تعذر الاتصال بالسيرفر. تأكد أن سيرفر FastAPI يعمل.", false);
        if (submitBtn) {
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
        }
    }
});