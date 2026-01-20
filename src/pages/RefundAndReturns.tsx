import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RefundAndReturns = () => {
  return (
    <div className="min-h-screen flex flex-col pt-32">
      <Header />
      
      {/* Header Banner */}
      <div className="bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary">
              Refund and Returns
            </h1>
            <PageBreadcrumb 
              items={[
                { label: "Home", href: "/" },
                { label: "Refund and Returns" }
              ]} 
            />
          </div>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-muted-foreground leading-relaxed">
              We want you to be completely satisfied with your purchase. This policy explains how to return books and request a refund or replacement.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Returning Faulty Books */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Returning Faulty Books</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Faulty books can be returned for a full refund or replacement.</li>
              <li>
                To arrange this, please email{" "}
                <a href="mailto:orders@cambridgescholars.com" className="text-red-500 hover:underline">
                  orders@cambridgescholars.com
                </a>{" "}
                within <strong className="text-foreground">7 days of receiving your book</strong>, quoting the invoice number included with your order.
              </li>
              <li>We will refund the postage charged for sending you the book, plus £4.50 to cover the cost of returning it to us.</li>
              <li>If you request a replacement, we will send you a replacement copy free of charge.</li>
            </ul>
          </section>

          <Separator className="my-8" />

          {/* Returning Non-Faulty Books */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Returning Non-Faulty Books</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                If your books are not faulty, you may return them within{" "}
                <strong className="text-foreground">14 days of receipt</strong> for a refund.
              </li>
              <li>
                Refunds for non-faulty books <strong className="text-foreground">exclude both our postage costs and your return postage costs</strong>.
              </li>
              <li>
                A refund will only be given if the books are returned in{" "}
                <strong className="text-foreground">resalable condition</strong>.
              </li>
              <li>
                For orders over <strong className="text-foreground">£100</strong>, an{" "}
                <strong className="text-foreground">administrative fee of 10%</strong> will be applied unless a prior agreement has been made.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Books purchased for <strong className="text-foreground">resale</strong> are not normally returnable unless agreed in advance at the time of purchase.
            </p>
          </section>

          <Separator className="my-8" />

          {/* How to Return Books */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">How to Return Books</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Please send all returns to:
            </p>
            <address className="text-muted-foreground not-italic leading-relaxed">
              Cambridge Scholars Publishing<br />
              Lady Stephenson Library<br />
              Welbeck Road<br />
              Newcastle upon Tyne<br />
              NE6 2PA<br />
              United Kingdom
            </address>
          </section>

          <Separator className="my-8" />

          {/* Postage Costs */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Postage Costs</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Postage costs depend on the number of books and the delivery destination. For large orders, please contact{" "}
              <a href="mailto:admin@cambridgescholars.com" className="text-red-500 hover:underline">
                admin@cambridgescholars.com
              </a>{" "}
              for a quote.
            </p>

            {/* UK Postage Prices */}
            <h3 className="font-playfair text-xl font-semibold text-primary mb-4">UK Postage Prices</h3>
            <Table className="mb-8">
              <TableHeader>
                <TableRow>
                  <TableHead>Number of Books</TableHead>
                  <TableHead>Price per Shipment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1 book</TableCell>
                  <TableCell>£3.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2-9 books</TableCell>
                  <TableCell>£4.15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>10-25 books</TableCell>
                  <TableCell>£9.95</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>25+ books</TableCell>
                  <TableCell>Contact us</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* International Postage Prices */}
            <h3 className="font-playfair text-xl font-semibold text-primary mb-4">International Postage Prices</h3>
            <Table className="mb-8">
              <TableHeader>
                <TableRow>
                  <TableHead>Delivery Method</TableHead>
                  <TableHead>Delivery Time</TableHead>
                  <TableHead>Number of Books</TableHead>
                  <TableHead>Price per Item</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Standard Postage Europe</TableCell>
                  <TableCell>2-3 weeks</TableCell>
                  <TableCell>1-5 books</TableCell>
                  <TableCell>£6.50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Standard Postage Rest of World</TableCell>
                  <TableCell>2-5 weeks</TableCell>
                  <TableCell>1-5 books</TableCell>
                  <TableCell>£6.50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Courier Tracked Postage</TableCell>
                  <TableCell>4-5 working days</TableCell>
                  <TableCell>6+ books</TableCell>
                  <TableCell>£6.50</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Estimated Delivery Times */}
            <h3 className="font-playfair text-xl font-semibold text-primary mb-4">Estimated Delivery Times</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destination</TableHead>
                  <TableHead>Courier</TableHead>
                  <TableHead>Standard Post</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>UK</TableCell>
                  <TableCell>24 hours</TableCell>
                  <TableCell>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Europe</TableCell>
                  <TableCell>2-3 days</TableCell>
                  <TableCell>2-3 weeks</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rest of World</TableCell>
                  <TableCell>3-5 days</TableCell>
                  <TableCell>2-5 weeks</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          <Separator className="my-8" />

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
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
