package com.example.demo.aspect;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

@Aspect
@Component
public class RequestLoggingAspect {

    @Autowired
    private HttpServletRequest request;

    @Pointcut("execution(* com.example.demo.controller..*(..))")
    public void controllerMethods() {}

    @Before("controllerMethods()")
    public void logRequestInfo(JoinPoint joinPoint) {
        // 取得請求資訊
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }

        // 轉換 IPv6 localhost
        if ("0:0:0:0:0:0:0:1".equals(ip)) {
            ip = "127.0.0.1";
        }

        String uri = request.getRequestURI();
        String method = request.getMethod();
        String args = Arrays.toString(joinPoint.getArgs());
        String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        String calledMethod = joinPoint.getSignature().toShortString();

        // 輸出記錄
        System.out.println("====================");
        System.out.println("Time: " + timestamp);
        System.out.println("Method: " + method + " " + uri);
        System.out.println("Call: " + calledMethod);
        System.out.println("Args: " + args);
        System.out.println("IP: " + ip);
        System.out.println("====================");        
    }
}


