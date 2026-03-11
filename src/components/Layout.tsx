import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  // Map route to tab value
  const getTabValue = () => {
    if (location.pathname === '/revenue') return 'revenue';
    if (location.pathname === '/settings') return 'settings';
    return 'board';
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header with navigation tabs */}
      <nav className="border-b border-gray-200">
        <Tabs value={getTabValue()} className="w-full">
          <TabsList className="w-full justify-start rounded-none bg-white p-0 h-auto">
            <Link to="/">
              <TabsTrigger 
                value="board"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-6 py-4"
              >
                Board
              </TabsTrigger>
            </Link>
            <Link to="/revenue">
              <TabsTrigger 
                value="revenue"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-6 py-4"
              >
                Revenue
              </TabsTrigger>
            </Link>
            <Link to="/settings">
              <TabsTrigger 
                value="settings"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-6 py-4"
              >
                Settings
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </nav>

      {/* Main content area with 24px padding (Spacious Calm) */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
