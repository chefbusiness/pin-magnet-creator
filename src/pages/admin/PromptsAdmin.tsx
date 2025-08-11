import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Plus, RefreshCw, Save, Copy, Search } from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  is_active: boolean;
  is_premium: boolean;
  sort_order: number | null;
  specialized_prompt: string;
  image_style_prompt: string | null;
  updated_at: string;
}

const PromptsAdmin = () => {
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [edits, setEdits] = useState<Record<string, Partial<Subcategory>>>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-prompts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("niche_subcategories")
        .select(
          "id,name,slug,category_id,is_active,is_premium,sort_order,specialized_prompt,image_style_prompt,updated_at"
        )
        .order("sort_order", { ascending: true, nullsFirst: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return data as Subcategory[];
    },
    enabled: !!user && isSuperAdmin(),
    staleTime: 60_000,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const s = search.trim().toLowerCase();
    if (!s) return data;
    return data.filter((x) =>
      [x.name, x.slug].some((v) => v?.toLowerCase().includes(s))
    );
  }, [data, search]);

  const updateMutation = useMutation({
    mutationFn: async (row: Subcategory) => {
      const patch = edits[row.id] || {};
      const payload = {
        specialized_prompt: patch.specialized_prompt ?? row.specialized_prompt,
        image_style_prompt: patch.image_style_prompt ?? row.image_style_prompt,
        is_active: patch.is_active ?? row.is_active,
        sort_order: patch.sort_order ?? row.sort_order,
      };
      const { error } = await supabase
        .from("niche_subcategories")
        .update(payload)
        .eq("id", row.id);
      if (error) throw error;
      return payload;
    },
    onSuccess: () => {
      toast({ title: "Guardado", description: "Prompts actualizados" });
      setEdits((prev) => ({}));
      queryClient.invalidateQueries({ queryKey: ["admin-prompts"] });
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message || "No se pudo guardar", variant: "destructive" });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (row: Subcategory & { newName: string; newSlug: string }) => {
      const { error } = await supabase.from("niche_subcategories").insert({
        name: row.newName,
        slug: row.newSlug,
        category_id: row.category_id,
        is_active: false,
        is_premium: row.is_premium,
        sort_order: (row.sort_order ?? 0) + 1,
        specialized_prompt: row.specialized_prompt,
        image_style_prompt: row.image_style_prompt,
        description: null,
        meta_title: null,
        meta_description: null,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Duplicado", description: "Subcategoría duplicada" });
      queryClient.invalidateQueries({ queryKey: ["admin-prompts"] });
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message || "No se pudo duplicar", variant: "destructive" });
    },
  });

  const onChangeField = (id: string, field: keyof Subcategory, value: any) => {
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  if (!user || !isSuperAdmin()) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-6xl px-4 py-10">
          <Card>
            <CardHeader>
              <CardTitle>Acceso denegado</CardTitle>
            </CardHeader>
            <CardContent>
              Debes ser Super Admin para acceder a esta sección.
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Prompts | PinCraft</title>
        <meta name="description" content="Panel para gestionar prompts de nichos en PinCraft" />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "https://pincraft.pro/admin/prompts"} />
      </Helmet>
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <section className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Gestión de Prompts (Nichos)</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-prompts"] })}>
                <RefreshCw className="h-4 w-4 mr-2" /> Refrescar
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">Edita prompts de texto e imagen, activa/desactiva y duplica subcategorías.</p>
        </section>

        <section className="mb-4">
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Buscar por nombre o slug"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Subcategorías</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                </div>
              ) : isError ? (
                <div className="text-destructive">Error al cargar datos</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Nombre</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead className="min-w-[280px]">Prompt de Texto</TableHead>
                        <TableHead className="min-w-[240px]">Prompt de Estilo de Imagen</TableHead>
                        <TableHead className="w-[120px] text-center">Activo</TableHead>
                        <TableHead className="w-[120px]">Orden</TableHead>
                        <TableHead className="w-[220px] text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((row) => {
                        const local = edits[row.id] || {};
                        return (
                          <TableRow key={row.id}>
                            <TableCell className="align-top">
                              <div className="font-medium">{row.name}</div>
                              <div className="text-xs text-muted-foreground">Actualizado: {new Date(row.updated_at).toLocaleString()}</div>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="text-xs text-muted-foreground">/{row.slug}</div>
                            </TableCell>
                            <TableCell className="align-top">
                              <Textarea
                                value={(local.specialized_prompt as string) ?? row.specialized_prompt}
                                onChange={(e) => onChangeField(row.id, "specialized_prompt", e.target.value)}
                                rows={5}
                              />
                            </TableCell>
                            <TableCell className="align-top">
                              <Textarea
                                value={(local.image_style_prompt as string) ?? row.image_style_prompt ?? ""}
                                onChange={(e) => onChangeField(row.id, "image_style_prompt", e.target.value)}
                                rows={4}
                              />
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="flex justify-center">
                                <Switch
                                  checked={(local.is_active as boolean) ?? row.is_active}
                                  onCheckedChange={(v) => onChangeField(row.id, "is_active", v)}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <Input
                                type="number"
                                value={(local.sort_order as number | null) ?? (row.sort_order ?? 0)}
                                onChange={(e) => onChangeField(row.id, "sort_order", Number(e.target.value))}
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => updateMutation.mutate(row)}
                                  disabled={updateMutation.isPending}
                                >
                                  <Save className="h-4 w-4 mr-2" /> Guardar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newName = window.prompt("Nuevo nombre", `${row.name} (copia)`);
                                    if (!newName) return;
                                    const suggestedSlug = `${row.slug}-copy`;
                                    const newSlug = window.prompt("Nuevo slug", suggestedSlug);
                                    if (!newSlug) return;
                                    duplicateMutation.mutate({ ...row, newName, newSlug });
                                  }}
                                  disabled={duplicateMutation.isPending}
                                >
                                  <Copy className="h-4 w-4 mr-2" /> Duplicar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default PromptsAdmin;
