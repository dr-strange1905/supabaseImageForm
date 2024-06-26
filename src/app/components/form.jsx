'use client'
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Form = () => {
  const [formData, setFormData] = useState({
    textField1: '',
    textField2: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0 ) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        

      const { fileData , error } = await supabase
        .storage
        .from('imagebucket') 
        .upload(`public/${formData.image.name}`, formData.image);

      if (error) {
        throw error;
      }

     
     

      const { publicURL, error: urlError } = supabase
      .storage
      .from('imagebucket') 
      .getPublicUrl(fileData.Key);

    if (urlError) {
      throw urlError;
    }


    setUploadedImageUrl(publicURL);


      const { data: insertData, error: insertError } = await supabase
        .from('form') 
        .insert([
          {
            textField1: formData.textField1,
            textField2: formData.textField2,
            publicURL,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      console.log('Data inserted successfully:', insertData);
      
    } catch (error) {
      console.error('Error:', error.message, formData.image.name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border border-gray-200 rounded-lg shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Text Field 1</label>
        <input
          type="text"
          name="textField1"
          value={formData.textField1}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Text Field 2</label>
        <input
          type="text"
          name="textField2"
          value={formData.textField2}
          onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="mt-1"
          required
        />
        {imagePreview && (
         <img src={imagePreview} alt="Image Preview" className="mt-2 w-32 h-32 rounded-lg shadow-md" />


        )}
      </div>
      <div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        >
          Submit
        </button>
      </div>
      { uploadedImageUrl && (
       <div className="mt-4">
       <h3 className="text-lg font-medium text-gray-700">Uploaded Image:</h3>
       <img src={uploadedImageUrl} alt="Uploaded" className="mt-2 w-full rounded-lg shadow-md" />
       </div>
      )}
    </form>


  );
};

export default Form;
