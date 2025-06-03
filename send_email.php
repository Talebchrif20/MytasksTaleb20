<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = "talebchrif200@gmail.com";
    $subject = "رسالة جديدة من موقعك الشخصي";
    $headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";

    $email_body = "اسم المرسل: $name\nبريد المرسل: $email\nالرسالة:\n$message\n";

    if (mail($to, $subject, $email_body, $headers)) {
        echo "<script>alert('تم إرسال رسالتك بنجاح!'); window.location.href = 'index.html';</script>";
    } else {
        echo "<script>alert('عذرًا، حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى لاحقًا.'); window.location.href = 'index.html';</script>";
    }
}
?>