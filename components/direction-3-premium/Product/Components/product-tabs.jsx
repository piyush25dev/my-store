import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function ProductTabs({ product }) {
  return (
    <Tabs defaultValue="description" className="space-y-6">
      <TabsList className="bg-transparent border-b border-gray-200/50 w-full justify-start gap-4 lg:gap-8 p-0 h-auto overflow-x-auto">
        <TabsTrigger 
          value="description" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 rounded-none px-2 py-4"
        >
          Description
        </TabsTrigger>
        <TabsTrigger 
          value="highlights" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 rounded-none px-2 py-4"
        >
          Highlights
        </TabsTrigger>
        <TabsTrigger 
          value="details" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 rounded-none px-2 py-4"
        >
          Details
        </TabsTrigger>
        <TabsTrigger 
          value="faq" 
          className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 rounded-none px-2 py-4"
        >
          FAQ
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>
        </div>
        
        {product.forWho && product.forWho.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Perfect For</h3>
            <div className="flex flex-wrap gap-2">
              {product.forWho.map((item, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="highlights" className="space-y-3">
        {product.highlights && product.highlights.map((highlight, index) => (
          <div 
            key={index} 
            className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50/30 to-white/30 border border-gray-200/30 backdrop-blur-sm"
          >
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 mt-2" />
            <p className="text-gray-700">{highlight}</p>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        {product.details && Object.entries(product.details).map(([key, value]) => (
          <div 
            key={key} 
            className="flex justify-between items-center py-4 border-b border-gray-100/50 last:border-0"
          >
            <span className="font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </span>
            <span className="text-gray-600">{value}</span>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="faq" className="space-y-4">
        {product.faqs && product.faqs.map((faq, index) => (
          <div 
            key={index} 
            className="space-y-3 p-6 rounded-xl bg-gradient-to-r from-gray-50/30 to-white/30 border border-gray-200/30 backdrop-blur-sm"
          >
            <h4 className="font-semibold text-gray-900">{faq.q}</h4>
            <p className="text-gray-600">{faq.a}</p>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
}