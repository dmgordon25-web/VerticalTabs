import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SidebarClose } from 'lucide-react';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Error Boundary for robust extension behavior
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-900 text-white p-4">
           <SidebarClose className="w-12 h-12 text-red-500 mb-4" />
           <h1 className="text-lg font-bold">Something went wrong.</h1>
           <p className="text-sm text-zinc-400">Try reloading the extension.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
