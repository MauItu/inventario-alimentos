// Archivo: pages/api/chatgpt/apigpt.js
import OpenAI from 'openai';
import jsPDF from 'jspdf';
import { getProductsByUser } from '../products';

// Función para limpiar la respuesta de markdown
function cleanJsonResponse(content) {
  try {
    // Si el contenido ya es JSON válido, lo retornamos directamente
    try {
      return JSON.parse(content);
    } catch (e) {
      // No es JSON válido, continuamos limpiando
    }
    
    // Eliminar los marcadores de código markdown ```json y ```
    let cleaned = content.replace(/```json\n/g, '')
                         .replace(/```\n/g, '')
                         .replace(/```/g, '')
                         .trim();
    
    // Intentar parsear el JSON limpio
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Error al limpiar o parsear JSON:", error);
    console.error("Contenido original:", content);
    throw new Error("No se pudo parsear la respuesta como JSON");
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    console.log(`Procesando solicitud para generar recetas para: ${email}`);
    
    // Configuración de OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Obtener productos del usuario
    const userProducts = await getProductsByUser(email);
    
    if (!userProducts || userProducts.length === 0) {
      return res.status(404).json({ error: 'No products found for this user' });
    }

    // Formatear los productos para enviar a GPT
    const productsList = userProducts.map(product => {
      return `${product.foodName} (${product.quantity} ${product.typeMeasure})`;
    }).join(', ');

    // Crear el prompt para GPT - pidiendo explícitamente que no formatee la respuesta con markdown
    const prompt = `Eres un chef experto. Usando únicamente los siguientes ingredientes: ${productsList}, 
    crea 7 recetas para almuerzo (una para cada día de la semana). 
    Cada receta debe tener un título, lista de ingredientes con cantidades apropiadas y pasos detallados para su preparación. 
    Si faltan ingredientes básicos (como sal, aceite), puedes sugerirlos. 
    Responde SOLO con JSON válido (sin formato markdown, sin comillas triple al inicio ni al final) con esta estructura:
    {
      "recetas": [
        {
          "dia": "Lunes",
          "titulo": "Nombre de la receta",
          "ingredientes": ["1 taza de arroz", "200g de pollo", ...],
          "preparacion": ["Paso 1: ...", "Paso 2: ...", ...]
        },
        ...más recetas para los días restantes
      ]
    }`;

    console.log("Enviando solicitud a OpenAI...");
    
    // Llamar a la API de GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Eres un chef profesional experto en crear recetas con ingredientes limitados. Responde únicamente con JSON válido sin formato markdown." 
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 2048,
      response_format: { type: "json_object" }, // Solicitar explícitamente formato JSON
    });

    // Obtener y limpiar la respuesta
    const content = completion.choices[0].message.content;
    console.log("Respuesta recibida de OpenAI");
    
    // Intentar parsear la respuesta correctamente
    let recetasJson;
    try {
      recetasJson = cleanJsonResponse(content);
      console.log("JSON parseado correctamente");
    } catch (error) {
      console.error("Error al parsear JSON:", error);
      return res.status(500).json({ 
        error: 'Ha ocurrido un error procesando su solicitud', 
        details: error.message,
        rawContent: content // Para debugging
      });
    }
    
    // Verificar que tenga la estructura esperada
    if (!recetasJson.recetas || !Array.isArray(recetasJson.recetas)) {
      console.error("Estructura JSON inesperada:", recetasJson);
      return res.status(500).json({ 
        error: 'La respuesta no tiene el formato esperado',
        details: 'No se encontró un array de recetas en la respuesta'
      });
    }
    
    console.log("Generando PDF...");
    
    // Generar PDF
    const pdf = new jsPDF();
    let yPos = 10;
    
    // Título del PDF
    pdf.setFontSize(20);
    pdf.text('Recetas de la Semana', 105, yPos, { align: 'center' });
    yPos += 15;
    
    // Añadir cada receta al PDF
    recetasJson.recetas.forEach((receta, index) => {
      if (yPos > 260) {
        pdf.addPage();
        yPos = 10;
      }
      
      // Título y día
      pdf.setFontSize(16);
      pdf.text(`${receta.dia}: ${receta.titulo}`, 10, yPos);
      yPos += 10;
      
      // Ingredientes
      pdf.setFontSize(12);
      pdf.text('Ingredientes:', 10, yPos);
      yPos += 6;
      
      receta.ingredientes.forEach(ingrediente => {
        pdf.setFontSize(10);
        pdf.text(`• ${ingrediente}`, 15, yPos);
        yPos += 5;
        
        if (yPos > 280) {
          pdf.addPage();
          yPos = 10;
        }
      });
      
      yPos += 5;
      
      // Preparación
      pdf.setFontSize(12);
      pdf.text('Preparación:', 10, yPos);
      yPos += 6;
      
      receta.preparacion.forEach((paso, i) => {
        const lines = pdf.splitTextToSize(paso, 180);
        
        lines.forEach(line => {
          if (i === 0) {
            pdf.setFontSize(10);
            pdf.text(`${i+1}. ${line}`, 15, yPos);
            i = -1; // Hack para que solo el primer línea tenga número
          } else {
            pdf.setFontSize(10);
            pdf.text(`   ${line}`, 15, yPos);
          }
          yPos += 5;
          
          if (yPos > 280) {
            pdf.addPage();
            yPos = 10;
          }
        });
      });
      
      // Separador entre recetas
      yPos += 10;
    });
    
    // Convertir PDF a base64
    const pdfBase64 = pdf.output('datauristring');
    console.log("PDF generado correctamente");
    
    return res.status(200).json({ 
      recetas: recetasJson.recetas,
      pdf: pdfBase64
    });
    
  } catch (error) {
    console.error('Error en el handler:', error);
    return res.status(500).json({ 
      error: 'Ha ocurrido un error procesando su solicitud',
      details: error.message
    });
  }
}

// La clase ChatGPTService debe estar en un archivo separado del lado cliente
export class ChatGPTService {
  static async generarRecetas(email) {
    try {
      console.log(`Enviando solicitud para generar recetas para: ${email}`);
      
      const response = await fetch('/api/chatgpt/apigpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la respuesta de la API:', errorData);
        throw new Error(errorData.error || 'Error generating recipes');
      }
      
      const data = await response.json();
      console.log('Recetas recibidas correctamente');
      
      // Descargar el PDF
      const link = document.createElement('a');
      link.href = data.pdf;
      link.download = 'recetas_de_la_semana.pdf';
      link.click();
      
      return data.recetas;
    } catch (error) {
      console.error('Error in ChatGPTService:', error);
      throw error;
    }
  }
}