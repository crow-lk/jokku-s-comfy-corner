const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-heading text-foreground mb-8">Privacy Policy</h1>
        <div className="max-w-3xl space-y-6 font-body text-muted-foreground">
          <p>Last updated: July 2026</p>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">At Jokku.lk</h2>
            <p>At Jokku.lk, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect customer information when you visit our website or place an order.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Information We Collect</h2>
            <p>We may collect the following information:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Delivery address</li>
              <li>Billing details</li>
              <li>Order details</li>
              <li>Payment confirmation details</li>
              <li>Device, browser, and website usage information</li>
            </ul>
            <p className="mt-2">We collect this information when you place an order, contact us, create an account, or use our website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Process and deliver your orders</li>
              <li>Contact you regarding your purchase</li>
              <li>Provide customer support</li>
              <li>Confirm payments</li>
              <li>Improve our website and services</li>
              <li>Send order updates or promotional messages, where applicable</li>
              <li>Prevent fraud or misuse of our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Payment Information</h2>
            <p>Online payments are processed through trusted third-party payment gateways. Jokku.lk does not store your full card details or sensitive payment information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Sharing Your Information</h2>
            <p>We do not sell or trade your personal information.</p>
            <p className="mt-2">However, we may share necessary details with trusted service providers such as:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Payment gateway providers</li>
              <li>Delivery and courier partners</li>
              <li>Website hosting and technical service providers</li>
              <li>Legal or regulatory authorities, if required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Cookies</h2>
            <p>Our website may use cookies to improve user experience, understand website traffic, and provide better service. You may disable cookies through your browser settings, but some website features may not work properly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Data Security</h2>
            <p>We take reasonable steps to protect your personal information from unauthorized access, misuse, loss, or disclosure. However, no online platform can guarantee 100% security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Changes to This Policy</h2>
            <p>Jokku.lk may update this Privacy Policy from time to time. Any changes will be published on this page.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or how your information is handled, please contact us through the contact details available on our website.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
