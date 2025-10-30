import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Tab = {
  title: string;
  value: string;
  content: React.ReactNode;
}

interface AdminTabsProps {
  tabs: Tab[];
}

export const AdminTabs = ({ tabs }: AdminTabsProps) => {
  return (
    <Tabs defaultValue={tabs[0].value}>
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex-1">{tab.title}</TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="w-full">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}