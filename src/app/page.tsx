import Form from './components/Form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div>
      <h1>Supabase Form</h1>
      <Form />
    </div>
    </main>
  );
}
