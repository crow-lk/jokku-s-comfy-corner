const RefundAndReturns = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-heading text-foreground mb-8">Refund & Return Policy</h1>
        <div className="max-w-3xl space-y-6 font-body text-muted-foreground">
          <p>Last updated: July 2026</p>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Thank You for Shopping at Jokku.lk</h2>
            <p>We want every customer to have a smooth and trustworthy shopping experience with us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Returns</h2>
            <p>Due to hygiene reasons, men's underwear products cannot be returned or exchanged once opened, used, washed, damaged, or removed from the original packaging.</p>
            <p className="mt-2">Returns or exchanges will only be accepted if:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>You received the wrong product</li>
              <li>You received the wrong size or colour</li>
              <li>The product was damaged or defective when delivered</li>
            </ul>
            <p className="mt-2">Customers must inform us within 3 days of receiving the order to request a return or exchange.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Refunds</h2>
            <p>Once we receive and inspect the returned item, we will notify you about the approval or rejection of your refund.</p>
            <p className="mt-2">If approved, the refund will be processed through the original payment method or another agreed method. Delivery charges are non-refundable unless the issue was caused by Jokku.lk.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Exchanges</h2>
            <p>If you receive the wrong item, wrong size, wrong colour, or a defective product, we will arrange an exchange based on product availability.</p>
            <p className="mt-2">The item must be unused, unwashed, and in its original packaging.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Non-Returnable Items</h2>
            <p>For hygiene and safety reasons, the following items are non-returnable and non-refundable:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Opened underwear packs</li>
              <li>Used or washed products</li>
              <li>Products damaged by the customer</li>
              <li>Items without original packaging</li>
              <li>Sale or promotional items, unless defective</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Return Shipping</h2>
            <p>If the return is due to an error from Jokku.lk, we will cover the return delivery cost. For other approved return cases, the customer may be responsible for return shipping charges.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Processing Time</h2>
            <p>Refunds and exchanges may take 3–7 business days after we receive and inspect the returned product.</p>
          </section>

          <section>
            <h2 className="text-2xl font-heading text-foreground mb-3">Contact Us</h2>
            <p>For return, exchange, or refund requests, please contact Jokku.lk customer support through the contact details provided on our website.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundAndReturns;
