
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Hotel } from "lucide-react";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-hotel p-4 rounded-full">
              <Hotel className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-display font-bold text-hotel mb-2">404</h1>
          <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find the page you were looking for. Perhaps you mistyped the URL or the page has been moved.
          </p>
          <div className="space-y-4">
            <Button className="bg-hotel hover:bg-hotel-light" asChild>
              <Link to="/">Return to Home</Link>
            </Button>
            <div className="flex justify-center">
              <Link to="/contact" className="text-hotel hover:underline">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
