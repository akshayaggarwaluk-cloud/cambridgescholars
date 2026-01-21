import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RefundAndReturns = () => {
  return (
    <div className="min-h-screen flex flex-col pt-20 text-black">
      <Header />

      {/* Header Banner */}
      <div className="bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-5xl font-serif text-black">Refund and Returns</h1>
          <PageBreadcrumb currentPage="Refund and Returns" />
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-black leading-relaxed text-[15px]">
              We want you to be completely satisfied with your purchase. This policy explains how to return books and
              request a refund or replacement.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Returning Faulty Books */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Returning Faulty Books</h2>
            <ul className="list-disc list-inside space-y-2 text-black text-[15px]">
              <li>Faulty books can be returned for a full refund or replacement.</li>
              <li>
                To arrange this, please email{" "}
                <a href="mailto:orders@cambridgescholars.com" className="text-red-500 hover:underline">
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
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Returning Non-Faulty Books</h2>
            <ul className="list-disc list-inside space-y-2 text-black text-[15px]">
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
            <p className="text-black leading-relaxed mt-4 text-[15px]">
              Books purchased for <strong className="text-black">resale</strong> are not normally returnable unless
              agreed in advance at the time of purchase.
            </p>
          </section>

          <Separator className="my-8" />

          {/* How to Return Books */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">How to Return Books</h2>
            <p className="text-black leading-relaxed mb-4 text-[15px]">Please send all returns to:</p>
            <address className="text-black not-italic leading-relaxed text-[15px]">
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
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Postage Costs</h2>
            <p className="text-black leading-relaxed mb-6 text-[15px]">
              Postage costs depend on the number of books and the delivery destination. For large orders, please contact{" "}
              <a href="mailto:admin@cambridgescholars.com" className="text-red-500 hover:underline">
                admin@cambridgescholars.com
              </a>{" "}
              for a quote.
            </p>

            {/* UK Postage Prices */}
            <h3 className="font-playfair text-xl font-semibold text-black mb-4">UK Postage Prices</h3>
            <Table className="mb-8">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black text-[15px]">Number of Books</TableHead>
                  <TableHead className="text-black text-[15px]">Price per Shipment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-black text-[15px]">1 book</TableCell>
                  <TableCell className="text-black text-[15px]">£3.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-black text-[15px]">2-9 books</TableCell>
                  <TableCell className="text-black text-[15px]">£4.15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-black text-[15px]">10-25 books</TableCell>
                  <TableCell className="text-black text-[15px]">£9.95</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-black text-[15px]">25+ books</TableCell>
                  <TableCell className="text-black text-[15px]">Contact us</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* International Postage Prices */}
            <h3 className="font-playfair text-xl font-semibold text-black mb-4">International Postage Prices</h3>
            <Table className="mb-8">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black text-[15px]">Delivery Method</TableHead>
                  <TableHead className="text-black text-[15px]">Delivery Time</TableHead>
                  <TableHead className="text-black text-[15px]">Number of Books</TableHead>
                  <TableHead className="text-black text-[15px]">Price per Item</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-black text-[15px]">Standard Postage Europe</TableCell>
                  <TableCell className="text-black text-[15px]">2-3 weeks</TableCell>
                  <TableCell className="text-black text-[15px]">1-5 books</TableCell>
                  <TableCell className="text-black text-[15px]">£6.50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-black text-[15px]">Standard Postage Rest of World</TableCell>
                  <TableCell className="text-black text-[15px]">2-5 weeks</TableCell>
                  <TableCell className="text-black text-[15px]">1-5 books</TableCell>
                  <TableCell className="text-black text-[15px]">£6.50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-black text-[15px]">Courier Tracked Postage</TableCell>
                  <TableCell className="text-black text-[15px]">4-5 working days</TableCell>
                  <TableCell className="text-black text-[15px]">6+ books</TableCell>
                  <TableCell className="text-black text-[15px]">£6.50</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Estimated Delivery Times */}
            <h3 className="font-playfair text-xl font-semibold text-black mb-4">Estimated Delivery Times</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black text-[15px]">Destination</TableHead>
                  <TableHead className="text-black text-[15px]">Courier</TableHead>
                  <TableHead className="text-black text-[15px]">Standard Post</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-black text-[15px]">UK</TableCell>
                  <TableCell className="text-black text-[15px]">24 hours</TableCell>
                  <TableCell className="text-black text-[15px]">N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-black text-[15px]">Europe</TableCell>
                  <TableCell className="text-black text-[15px]">2-3 days</TableCell>
                  <TableCell className="text-black text-[15px]">2-3 weeks</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-black text-[15px]">North America</TableCell>
                  <TableCell className="text-black text-[15px]">3-5 days</TableCell>
                  <TableCell className="text-black text-[15px]">2-5 weeks</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-black text-[15px]">Rest of the World</TableCell>
                  <TableCell className="text-black text-[15px]">Up to 7 days</TableCell>
                  <TableCell className="text-black text-[15px]">4–5 weeks</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          <Separator className="my-8" />

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Contact Us</h2>
            <p className="text-black leading-relaxed text-[15px]">
              If you have any questions about returns or refunds, please contact us at{" "}
              <a href="mailto:orders@cambridgescholars.com" className="text-red-500 hover:underline">
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
