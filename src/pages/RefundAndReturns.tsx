import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RefundAndReturns = () => {
  return (
    <div className="min-h-screen flex flex-col  text-black">
      <Header />

      {/* Header Banner */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Refund and Returns</h1>
          <PageBreadcrumb currentPage="Refund and Returns" />
        </div>
      </div>

      <main className="flex-1 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-8">
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav">
              We want you to be completely satisfied with your purchase. This policy explains how to return books and
              request a refund or replacement.{" "}
              <span className="text-black">
                Please note these policies apply to print books only. Ebooks are individually assigned via email and are non-refundable.
              </span>
            </p>
          </div>

          <Separator className="my-8" />

          {/* Returning Faulty Books */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold text-[#333333] mb-3">Returning Faulty Books</h2>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav mb-4">
              This policy does not apply to ebooks, which are individually assigned and non-refundable.
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#333333] text-[16px] font-nav">
              <li>Faulty books can be returned for a full refund or replacement.</li>
              <li>
                To arrange this, please email{" "}
                <a href="mailto:orders@cambridgescholars.com" className="text-[#C75B2A] hover:underline">
                  orders@cambridgescholars.com
                </a>{" "}
                within <strong className="text-black">7 days of receiving your book</strong>, quoting the invoice number
                included with your order.
              </li>
              <li>
                We will refund the postage charged for sending you the book, plus £4.50 to cover the cost of returning
                it to us.
              </li>
              <li>If you request a replacement, we will send you a replacement copy free of charge.</li>
            </ul>
          </section>

          <Separator className="my-8" />

          {/* Returning Non-Faulty Books */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold text-[#333333] mb-3">Returning Non-Faulty Books</h2>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav mb-4">
              This policy does not apply to ebooks, which are individually assigned and non-refundable.
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#333333] text-[16px] font-nav">
              <li>
                If your books are not faulty, you may return them within{" "}
                <strong className="text-black">14 days of receipt</strong> for a refund.
              </li>
              <li>
                Refunds for non-faulty books{" "}
                <strong className="text-black">exclude both our postage costs and your return postage costs</strong>.
              </li>
              <li>
                A refund will only be given if the books are returned in{" "}
                <strong className="text-black">resalable condition</strong>.
              </li>
              <li>
                For orders over <strong className="text-black">£100</strong>, an{" "}
                <strong className="text-black">administrative fee of 10%</strong> will be applied unless a prior
                agreement has been made.
              </li>
            </ul>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav mt-4">
              Books purchased for <strong className="text-black">resale</strong> are not normally returnable unless
              agreed in advance at the time of purchase.
            </p>
          </section>

          <Separator className="my-8" />

          {/* How to Return Books */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold text-[#333333] mb-3">How to Return Books</h2>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav mb-4">Please send all returns to:</p>
            <address className="not-italic leading-[1.7] text-[#333333] text-[16px] font-nav">
              Cambridge Scholars Publishing
              <br />
              Lady Stephenson Library
              <br />
              Welbeck Road
              <br />
              Newcastle upon Tyne
              <br />
              NE6 2PA
              <br />
              United Kingdom
            </address>
          </section>

          <Separator className="my-8" />

          {/* Postage Costs */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold text-[#333333] mb-3">Postage Costs</h2>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav mb-6">
              Postage costs depend on the number of books and the delivery destination. For large orders, please contact{" "}
              <a href="mailto:admin@cambridgescholars.com" className="text-[#C75B2A] hover:underline">
                admin@cambridgescholars.com
              </a>{" "}
              for a quote.
            </p>

            {/* UK Postage Prices */}
            <h3 className="font-playfair text-xl font-medium text-black mb-4">UK Postage Prices</h3>
            <Table className="mb-8">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#333333] text-[16px] font-nav">Number of Books</TableHead>
                  <TableHead className="text-[#333333] text-[16px] font-nav">Price per Shipment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-[#333333] text-[16px] font-nav">1 book</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">£3.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#333333] text-[16px] font-nav">2-9 books</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">£4.15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#333333] text-[16px] font-nav">10-25 books</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">£9.95</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#333333] text-[16px] font-nav">25+ books</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">Contact us</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* International Postage Prices */}
            <h3 className="font-playfair text-xl font-medium text-black mb-4">International Postage Prices</h3>
            <Table className="mb-8">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#333333] text-[16px] font-nav">Delivery Method</TableHead>
                  <TableHead className="text-[#333333] text-[16px] font-nav">Delivery Time</TableHead>
                  <TableHead className="text-[#333333] text-[16px] font-nav">Number of Books</TableHead>
                  <TableHead className="text-[#333333] text-[16px] font-nav">Price per Item</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-[#333333] text-[16px] font-nav">Standard Postage Europe</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">2-3 weeks</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">1-5 books</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">£6.50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#333333] text-[16px] font-nav">Standard Postage Rest of World</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">2-5 weeks</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">1-5 books</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">£6.50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#333333] text-[16px] font-nav">Courier Tracked Postage</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">4-5 working days</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">6+ books</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">£6.50</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Estimated Delivery Times */}
            <h3 className="font-playfair text-xl font-medium text-black mb-4">Estimated Delivery Times</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#333333] text-[16px] font-nav">Destination</TableHead>
                  <TableHead className="text-[#333333] text-[16px] font-nav">Courier</TableHead>
                  <TableHead className="text-[#333333] text-[16px] font-nav">Standard Post</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-[#333333] text-[16px] font-nav">UK</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">24 hours</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#333333] text-[16px] font-nav">Europe</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">2-3 days</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">2-3 weeks</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#333333] text-[16px] font-nav">North America</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">3-5 days</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">2-5 weeks</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-[#333333] text-[16px] font-nav">Rest of the World</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">Up to 7 days</TableCell>
                  <TableCell className="text-[#333333] text-[16px] font-nav">4–5 weeks</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          <Separator className="my-8" />

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold text-[#333333] mb-3">Contact Us</h2>
            <p className="leading-[1.7] text-[#333333] text-[16px] font-nav">
              If you have any questions about returns or refunds, please contact us at{" "}
              <a href="mailto:orders@cambridgescholars.com" className="text-[#C75B2A] hover:underline">
                orders@cambridgescholars.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundAndReturns;
