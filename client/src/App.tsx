import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Article from "./pages/Article";
import Category from "./pages/Category";
import AdminDashboard from "./pages/AdminDashboard";
import ArticleEditor from "./pages/ArticleEditor";
import Search from "./pages/Search";
import Categories from "./pages/Categories";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path={"\\"} component={Home} />
          <Route path={"/search"} component={Search} />
          <Route path={"/categories"} component={Categories} />
          <Route path={"/article/:slug"} component={Article} />
          <Route path={"/category/:slug"} component={Category} />
          <Route path={"/admin"} component={AdminDashboard} />
          <Route path={"/admin/articles/new"} component={ArticleEditor} />
          <Route path={"/admin/articles/:id/edit"} component={ArticleEditor} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
