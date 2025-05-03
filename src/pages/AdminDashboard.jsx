import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, UserPlus, ListOrdered } from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://redojogbxdtqxqzxvyhp.supabase.co/storage/v1/object/public/imagenes/imagenes/foto-defecto.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="z-10 w-full max-w-md px-4">
        <Card className="bg-white/90 rounded-2xl shadow-lg p-6">
          <CardContent className="flex flex-col gap-5">
            <h2 className="text-2xl font-semibold text-center mb-4 text-black">Panel del Administrador</h2>

            <Button
              className="w-full flex gap-2 justify-center"
              onClick={() => navigate('/admin/register-user')}
            >
              <UserPlus className="w-5 h-5" />
              Registrar nuevo socio o administrador
            </Button>

            <Button
              className="w-full flex gap-2 justify-center"
              onClick={() => navigate('/admin/create-restaurant')}
            >
              <Plus className="w-5 h-5" />
              Crear nuevo restaurante
            </Button>

            <Button
              className="w-full flex gap-2 justify-center"
              onClick={() => navigate('/admin/restaurantes')}
            >
              <ListOrdered className="w-5 h-5" />
              Gestionar restaurantes existentes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
