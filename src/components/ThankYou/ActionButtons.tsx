
import React from "react";
import { Link } from "react-router-dom";
import { Home, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActionButtons: React.FC = () => {
  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
      <Button
        className="bg-shopez-accent hover:bg-shopez-500 flex items-center justify-center gap-2"
        asChild
      >
        <Link to="/">
          <Home className="h-4 w-4" />
          <span>Return to Home</span>
        </Link>
      </Button>
      
      <Button
        variant="outline"
        asChild
      >
        <Link to="/orders">
          <Package className="h-4 w-4 mr-2" />
          Track Your Order
        </Link>
      </Button>
    </div>
  );
};

export default ActionButtons;
