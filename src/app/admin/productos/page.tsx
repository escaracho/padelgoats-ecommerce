'use client';

import { useState, useEffect } from 'react';
import { getProductos, createProduct, updateProduct, deleteProduct, Product } from '@/app/services/dynamodb';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { withAdminAccess } from '@/components/withAdminAccess';
import ProductForm from '@/app/components/ProductForm';
import { toast } from 'react-hot-toast';

function ProductosAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductos();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (product?: Product) => {
    setSelectedProduct(product || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedProduct(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (productData: Partial<Product>) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.ProductoID, productData);
      } else {
        await createProduct(productData as Omit<Product, 'ProductoID'>);
      }
      handleCloseForm();
      loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Error al guardar el producto');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteProduct(id);
      toast.success('Producto eliminado exitosamente');
      // Refresh the products list
      const updatedProducts = await getProductos();
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      // Show the specific error message if available
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el producto';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.Descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.Categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.Categoria))].filter(Boolean);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="mt-2 text-gray-600">Administra el catálogo de productos</p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            <FaPlus /> Nuevo Producto
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 pl-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category, index) => (
                <option key={`${category}-${index}`} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800">
            <p>{error}</p>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-hidden rounded-lg border bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredProducts.map((product) => (
                  <tr key={product.ProductoID} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <img
                        src={product.ImagenURL}
                        alt={product.Nombre}
                        className="h-16 w-16 rounded object-cover"
                        onMouseOver={e => (e.currentTarget.src = product.ImagenHoverURL)}
                        onMouseOut={e => (e.currentTarget.src = product.ImagenURL)}
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.Nombre}</div>
                      <div className="text-sm text-gray-500">{product.Marca}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs" title={product.Descripcion}>
                        {product.Descripcion}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{product.Categoria}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">${Number(product.Precio).toLocaleString('es-AR')}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{product.Stock}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenForm(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.ProductoID)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="mt-8 rounded-lg bg-white p-8 text-center shadow">
            <p className="text-xl text-gray-600">No se encontraron productos</p>
            <p className="mt-2 text-gray-500">
              {searchTerm || filterCategory 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Haz clic en "Nuevo Producto" para agregar uno'}
            </p>
          </div>
        )}

        {/* Product Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
              <ProductForm
                product={selectedProduct}
                onSubmit={handleSubmit}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAdminAccess(ProductosAdmin); 