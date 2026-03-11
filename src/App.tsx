import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Freelancer Tracking App</CardTitle>
            <CardDescription>Vite + React + TypeScript + Tailwind + shadcn/ui</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-8 justify-center mb-8">
              <a href="https://vite.dev" target="_blank" rel="noreferrer">
                <img src={viteLogo} className="h-24 hover:scale-110 transition-transform" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank" rel="noreferrer">
                <img src={reactLogo} className="h-24 hover:scale-110 transition-transform" alt="React logo" />
              </a>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-slate-900">Counter Example</h2>
                <p className="text-slate-600 mb-4">Count: <span className="text-2xl font-bold text-slate-900">{count}</span></p>
                <Button 
                  onClick={() => setCount((count) => count + 1)}
                  className="w-full"
                >
                  Increment Counter
                </Button>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-slate-900">Features Ready</h2>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span> Tailwind CSS styling
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span> shadcn/ui components (Button, Card)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span> Path aliases (@/components, @/lib)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span> PWA ready with service worker
                  </li>
                </ul>
              </div>

              <p className="text-center text-sm text-slate-600">
                Edit <code className="bg-slate-200 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
