"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { FaCreditCard, FaLock, FaShieldAlt, FaSpinner } from "react-icons/fa";
import { getCurrentEnvironment } from "@/lib/moyasar";

export default function MoyasarForm({
  amount,
  description,
  orderId,
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  locale,
  onSuccess,
  onError,
  onClose,
}) {
  const formRef = useRef(null);
  const initializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const env = getCurrentEnvironment();
  const isArabic = locale === "ar";

  // Safely parse amount as number
  const numericAmount = Number(amount) || 0;

  // Memoized handlers using updated props
  const handleCompleted = useCallback(
    async (payment) => {
      console.log("Payment completed:", payment);
      try {
        await onSuccess(payment.id, payment.id);
        return Promise.resolve();
      } catch (error) {
        console.error("Error in on_completed:", error);
        return Promise.reject(error);
      }
    },
    [onSuccess],
  );

  const handleFailed = useCallback(
    async (error) => {
      console.error("Payment failed:", error);
      try {
        onError(error.message || (isArabic ? "فشل الدفع" : "Payment failed"));
        return Promise.resolve();
      } catch (err) {
        console.error("Error in on_failed handler:", err);
        return Promise.reject(err);
      }
    },
    [onError, isArabic],
  );

  useEffect(() => {
    let timer;

    const loadMoyasar = async () => {
      if (typeof window === "undefined" || initializedRef.current) return;

      try {
        setIsLoading(true);
        setLoadError(null);

        // Load CSS if not present
        if (!document.querySelector('link[href*="moyasar.css"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href =
            "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.4/dist/moyasar.css";
          document.head.appendChild(link);
        }

        // Load SDK Script if not present
        if (!window.Moyasar) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.4/dist/moyasar.umd.min.js";
            script.async = true;
            script.onload = () => setTimeout(resolve, 100);
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (formRef.current && window.Moyasar) {
          const callbackUrl = `${window.location.origin}/${locale}/payment-result`;
          const amountInHalalas = Math.round(numericAmount * 100);

          // Clear element before initialization
          formRef.current.innerHTML = "";

          window.Moyasar.init({
            element: formRef.current,
            amount: amountInHalalas,
            currency: "SAR",
            description: description,
            publishable_api_key: env.publishableKey,
            callback_url: callbackUrl,
            supported_networks: ["visa", "mastercard", "mada"],
            methods: ["creditcard"],
            metadata: {
              orderId,
              orderNumber,
              customerName,
              customerEmail,
              customerPhone,
              environment: env.env,
            },
            on_completed: handleCompleted,
            on_failed: handleFailed,
          });

          initializedRef.current = true;
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load Moyasar:", error);
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        setLoadError(errorMsg);
        onError(
          isArabic ? "فشل تحميل نموذج الدفع" : "Failed to load payment form",
        );
        setIsLoading(false);
      }
    };

    timer = setTimeout(() => {
      loadMoyasar();
    }, 300);

    return () => {
      clearTimeout(timer);
      if (formRef.current) {
        formRef.current.innerHTML = "";
      }
      initializedRef.current = false;
    };
  }, [
    numericAmount,
    description,
    orderId,
    orderNumber,
    customerName,
    customerEmail,
    customerPhone,
    locale,
    handleCompleted,
    handleFailed,
    onError,
    isArabic,
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-tahini-gold to-tahini-brown p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaCreditCard />
              {isArabic ? "الدفع الإلكتروني" : "Secure Payment"}
            </h2>
            <p className="text-sm opacity-90 mt-1">
              {isArabic ? "الطلب رقم" : "Order #"} {orderNumber}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                env.isTest
                  ? "bg-yellow-400 text-yellow-900"
                  : "bg-green-400 text-green-900"
              }`}
            >
              {env.isTest
                ? isArabic
                  ? "وضع الاختبار"
                  : "TEST"
                : isArabic
                  ? "مباشر"
                  : "LIVE"}
            </span>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <FaLock className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Test Mode Alert */}
      {env.isTest && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 text-lg">⚠️</div>
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                {isArabic ? "وضع الاختبار مفعل" : "Test Mode Active"}
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                {isArabic
                  ? "يتم استخدام بيانات اختبار الدفع. لن يتم خصم أي مبلغ حقيقي."
                  : "Using test payment credentials. No real money will be charged."}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <div className="bg-yellow-100 px-2 py-1 rounded text-xs">
                  <span className="font-medium">Visa:</span> 4111 1111 1111 1111
                </div>
                <div className="bg-yellow-100 px-2 py-1 rounded text-xs">
                  <span className="font-medium">Mada:</span> 4406 4712 3456 7890
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Amount */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            {isArabic ? "المبلغ المطلوب" : "Amount Due"}
          </span>
          <span className="text-3xl font-bold text-tahini-gold">
            {numericAmount.toFixed(2)} SAR
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <FaShieldAlt className="text-green-500" />
          <span>{isArabic ? "مدفوعات آمنة" : "Secure Payments"}</span>
          <span className="mx-1">•</span>
          <span>
            {isArabic ? "جميع البطاقات مقبولة" : "All cards accepted"}
          </span>
        </div>
      </div>

      {/* Moyasar Form Container */}
      <div className="p-6">
        {loadError ? (
          <div className="text-center py-8">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-gray-700 mb-4">{loadError}</p>
            <button
              onClick={() => {
                setLoadError(null);
                initializedRef.current = false;
                if (formRef.current) {
                  formRef.current.innerHTML = "";
                }
                window.location.reload();
              }}
              className="bg-tahini-gold text-white px-6 py-2 rounded-lg hover:bg-tahini-brown transition-colors"
            >
              {isArabic ? "المحاولة مرة أخرى" : "Retry"}
            </button>
          </div>
        ) : (
          <>
            <div className="min-h-[350px] relative">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
                  <FaSpinner className="w-8 h-8 animate-spin text-tahini-gold mb-4" />
                  <p className="text-gray-500">
                    {isArabic
                      ? "جاري تحميل نموذج الدفع..."
                      : "Loading payment form..."}
                  </p>
                </div>
              )}

              <div ref={formRef} className="moyasar-form" />
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                {isArabic
                  ? "جميع المدفوعات مشفرة وآمنة"
                  : "All payments are encrypted and secure"}
              </p>
              <div className="flex justify-center gap-4 mt-2 text-2xl">
                <span title="Mada">🏦</span>
                <span title="Visa">💳</span>
                <span title="Mastercard">💳</span>
              </div>
            </div>

            {/* Close/Cancel Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                {isArabic ? "إلغاء الدفع" : "Cancel Payment"}
              </button>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 border-t">
        <div className="flex justify-center gap-6 text-xs text-gray-500">
          <span>🔒 {isArabic ? "اتصال آمن" : "Secure Connection"}</span>
          <span>✓ {isArabic ? "مدفوعات مشفرة" : "Encrypted Payments"}</span>
          <span>✓ {isArabic ? "حماية 3D Secure" : "3D Secure Protection"}</span>
        </div>
      </div>
    </div>
  );
}
