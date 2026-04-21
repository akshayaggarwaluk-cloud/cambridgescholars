import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col text-black">
      <Header />

      {/* Header Banner */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Terms and Conditions</h1>
          <PageBreadcrumb
            currentPage="Terms and Conditions

"
          />
        </div>
      </div>

      <main className="flex-1 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-8">
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav">
              These Terms and Conditions govern the direct sale of Cambridge Scholars Publishing titles to consumers.
            </p>
          </div>

          <Separator className="my-8" />

          {/* 1. Definitions */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold mb-3 text-[#333333]">1. Definitions</h2>
            <p className="leading-relaxed mb-4 text-[#333333] text-[16px] font-nav">
              <strong>The Company</strong> refers to Cambridge Scholars Publishing Ltd, a company registered in England
              and Wales, company registration number 04333775, VAT number 108280727. Registered address: Lady Stephenson
              Library, Welbeck Road, Newcastle upon Tyne, NE6 2PA, United Kingdom.
            </p>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav">
              <strong>The Customer</strong> refers to the person placing an order by any of the methods made available
              by the Company. These terms apply only to individuals purchasing for personal use as defined under UK
              consumer law.
            </p>
          </section>

          <Separator className="my-8" />

          {/* 2. Description of Items */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold mb-3 text-[#333333]">2. Description of Items</h2>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav">
              The books and other products available for sale are as described on the relevant pages of our website at{" "}
              <a href="https://www.cambridgescholars.com" className="text-black underline">
                www.cambridgescholars.com
              </a>
              .
            </p>
          </section>

          <Separator className="my-8" />

          {/* 3. Pricing and Taxes */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold mb-3 text-[#333333]">3. Pricing and Taxes</h2>
            <ul className="list-disc list-inside space-y-2 text-[#333333] text-[16px] font-nav">
              <li>
                All prices include applicable taxes. Books are currently zero rated for VAT in the UK so tax is not
                shown separately for these items.
              </li>
              <li>
                Any customs charges, import duties, VAT or other fees imposed outside the UK are the responsibility of
                the Customer. The Company cannot refund any charges for unclaimed books held at customs or other import
                locations.
              </li>
              <li>Prices are subject to change without notice.</li>
            </ul>
            <p className="leading-relaxed mt-4 text-[#333333] text-[16px] font-nav">
              When ordering from outside the UK you are considered the importer and must comply with the laws of the
              country where you receive the goods. Customs policies vary so we advise checking with your local customs
              office for further information.
            </p>
          </section>

          <Separator className="my-8" />

          {/* 4. Delivery */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold mb-3 text-[#333333]">4. Delivery</h2>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav">
              Delivery costs are shown during the checkout process and on the ordering information page of our website.
              For large orders, the Company may be able to offer a reduced shipping rate but is not obliged to do so. A
              delivery date cannot be guaranteed. Postage charges will not be refunded for late deliveries.
            </p>
          </section>

          <Separator className="my-8" />

          {/* 5. Payment */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold mb-3 text-[#333333]">5. Payment</h2>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav">
              Payment can be made by credit card, bank transfer or cheque in Pounds Sterling or US Dollars.
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#333333] text-[16px] font-nav">
              <li>
                For card payments, the Company stores payment details securely at the time of order and charges the card
                when the books are ready to be dispatched. Invoices are issued when payment is taken.
              </li>
              <li>
                For bank transfers or cheques, full payment is required in advance. Orders will be dispatched once funds
                have cleared.
              </li>
              <li>Any bank charges incurred for transfers must be paid by the Customer.</li>
              <li>
                All card payments are processed in Pounds Sterling. The actual charge in other currencies may vary
                according to your card provider's exchange rate.
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          {/* 6. Cancellations and Returns */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold mb-3 text-[#333333]">6. Cancellations and Returns</h2>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav">
              Customers have the right to cancel their order in accordance with the UK Consumer Contracts Regulations.
              You can cancel within 14 days of receiving your order by contacting us in writing.
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#333333] text-[16px] font-nav">
              <li>
                If the books are faulty, we will provide a full refund including return postage (up to the amount
                originally charged for delivery).
              </li>
              <li>
                If you cancel for any other reason, a refund will be issued once we receive the returned books. Postage
                costs for delivery and return will not be refunded. Cancellations can be made by:
              </li>
              <li>Sending a written notice to the address above</li>
              <li>Emailing orders@cambridgescholars.com</li>
              <li>Posting a letter to the Orders Department at our registered address</li>
            </ul>
            <br />
            <p className="text-[#333333] text-[16px] font-nav">
              Until the books are returned, you must take reasonable care of them.
            </p>
          </section>

          <Separator className="my-8" />

          {/* 7. Complaints */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold mb-3 text-[#333333]">7. Complaints</h2>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav">
              Complaints can be addressed in writing to Cambridge Scholars Publishing at the registered address above or
              by email to orders@cambridgescholars.com.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
