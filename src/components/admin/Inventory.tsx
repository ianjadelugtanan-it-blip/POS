import React, { useState } from 'react';
import { Package, Plus, Trash2, ImagePlus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { API_BASE_URL } from '../../context/AppContextProvider';

export const Inventory: React.FC = () => {
  const { products, setProducts } = useAppContext();
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const result = await response.json();

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert(result.error || "Failed to delete product.");
      }
    } catch {
      alert("Connection error.");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !category) return;

    const productData = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      category,
      imageUrl
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/products/save.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        // Refresh product list
        const prodRes = await fetch(`${API_BASE_URL}/products/get.php`);
        if (prodRes.ok) setProducts(await prodRes.json());
        
        setShowForm(false);
        setName(''); setPrice(''); setStock(''); setCategory(''); setImageUrl('');
      } else {
        const result = await response.json();
        alert(result.error || "Failed to save product.");
      }
    } catch {
      alert("Connection error.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Management</h2>
           <p className="text-gray-500 mt-1">Manage your product catalog and insert distinct visuals.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm px-6 py-3 rounded-full"
        >
          <Plus className={`w-4 h-4 transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
          {showForm ? 'Cancel Entry' : 'Manual Entry'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-8 border-t-4 border-blue-500 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-lg mb-4 text-gray-900">Define New Object</h3>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="input-field" placeholder="Mechanical Switch" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <input type="text" value={category} onChange={e=>setCategory(e.target.value)} required className="input-field" placeholder="Components" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₱)</label>
              <input type="number" min="0" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} required className="input-field" placeholder="10.50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Count</label>
              <input type="number" min="0" value={stock} onChange={e=>setStock(e.target.value)} required className="input-field" placeholder="100" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5"><ImagePlus className="w-3.5 h-3.5"/> Product Image (Optional)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-200 rounded-xl" 
              />
              {imageUrl && (
                <div className="mt-3 flex items-center gap-3">
                  <img src={imageUrl} alt="preview" className="w-12 h-12 object-cover rounded-md border border-gray-200 shadow-sm" />
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">Visual Successfully Attached</span>
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" className="btn-primary rounded-full px-8 py-3 w-full md:w-auto shadow-md hover:shadow-xl">Store Product Object</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Visual</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group animate-cascade" style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="p-4 pl-6 text-sm font-mono text-gray-500">
                    {product.id}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="p-4">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt="preview" className="w-10 h-10 object-cover rounded-md shadow-sm border border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-400 font-bold">N/A</div>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-medium text-gray-900">
                    ₱{product.price.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock <= 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-inner border border-gray-200">
                        <Package className="w-8 h-8 text-gray-300" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-1">Inventory Empty</p>
                        <p className="text-gray-500">Initiate a manual entry above to formulate a product.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
