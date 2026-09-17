// Importamos la función useState desde la librería de React para manejar variables de estado en nuestro componente.
import { useState } from 'react';

// Exportamos la función principal del componente con el nombre "App", que renderizará la interfaz en pantalla.
export default function App() {
  // --- ESTADOS POKÉBUSCADOR (Punto 5) ---
  // Crea la variable 'pokemonName' para almacenar el texto escrito por el usuario en el campo de entrada (input).
  const [pokemonName, setPokemonName] = useState('');
  // Crea la variable 'pokemonData' que guardará el objeto completo con la información recibida desde la PokéAPI.
  const [pokemonData, setPokemonData] = useState(null);
  // Crea un estado booleano 'isLoading' para rastrear si hay una petición HTTP activa y mostrar/ocultar un indicador de carga.
  const [isLoading, setIsLoading] = useState(false);
  // Crea la variable 'error' para almacenar mensajes textuales de fallo cuando una consulta a la API no resulte bien.
  const [error, setError] = useState(null);

  // --- ESTADOS Y MÉTODOS CRUD (Punto 6) ---
  // Crea el estado 'crudResult' para almacenar el mensaje o la respuesta obtenida al realizar operaciones POST, PUT o DELETE.
  const [crudResult, setCrudResult] = useState('');

  // 1. Buscar Pokémon (GET con Fetch API)
  // Función asíncrona que procesa la búsqueda del Pokémon al enviar el formulario.
  const searchPokemon = async (e) => {
    // Evita la recarga automática de toda la página web asociada al envío tradicional de formularios en HTML.
    e.preventDefault();
    // Verifica si la cadena de texto está vacía tras quitar espacios en blanco; si no hay texto, detiene la ejecución.
    if (!pokemonName.trim()) return;

    // Patrón de los 3 estados:
    // Activa la bandera de carga para inhabilitar botones o mostrar elementos visuales de espera.
    setIsLoading(true);
    // Reinicia el mensaje de error anterior por si la nueva búsqueda resulta exitosa.
    setError(null);
    // Limpia la información del Pokémon mostrado anteriormente.
    setPokemonData(null);

    // Bloque para intentar ejecutar operaciones asíncronas propensas a fallos de red o errores HTTP.
    try {
      // Realiza la petición GET HTTP a la PokeAPI pasando el nombre transformado a minúsculas y sin espacios.
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase().trim()}`
      );

      // Evalúa si el código de estado HTTP de la respuesta está fuera del rango exitoso (200-299).
      if (!response.ok) {
        // Si el estado es 404, lanza un error personalizado indicando que el recurso solicitado no fue encontrado.
        if (response.status === 404) {
          throw new Error('El Pokémon no existe en la base de datos.');
        }
        // Para cualquier otro código de error HTTP (ej. 500), arroja un mensaje con el código devuelto por el servidor.
        throw new Error(`Error en el servidor: Estatus ${response.status}`);
      }

      // Procesa y transforma el cuerpo de la respuesta HTTP recibida en formato de texto JSON a un objeto JavaScript utilizable.
      const data = await response.json();
      // Actualiza el estado con los datos recuperados para detonar el re-renderizado de la interfaz.
      setPokemonData(data);
    } catch (err) {
      // Si se produce una excepción en 'try' o dentro del 'fetch', guarda el texto de dicho error en el estado.
      setError(err.message);
    } finally {
      // Cláusula de cierre que se ejecuta siempre al terminar la petición (con éxito o con error) para desactivar el loader.
      setIsLoading(false);
    }
  };

  // 2. CREATE (POST)
  // Función asíncrona para simular la creación de un nuevo recurso mediante la API de prueba JSONPlaceholder.
  const handleCreatePost = async () => {
    try {
      // Informa al usuario en la pantalla que la petición POST se está procesando.
      setCrudResult('Enviando POST...');
      // Envía una petición POST con los datos serializados en el cuerpo a la URL correspondiente.
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST', // Especifica el método HTTP para la creación de datos.
        headers: { 'Content-Type': 'application/json' }, // Declara que el cuerpo de la solicitud contiene formato JSON.
        body: JSON.stringify({ title: 'Nuevo Post', body: 'Contenido del post', userId: 1 }), // Convierte el objeto a string JSON.
      });
      // Verifica que la respuesta de creación haya sido satisfactoria.
      if (!response.ok) throw new Error('Error al crear el recurso');
      // Convierte la respuesta recibida desde el servidor en un objeto utilizable.
      const data = await response.json();
      // Despliega el identificador único (ID) asignado al nuevo registro devuelto por el servidor ficticio.
      setCrudResult(`POST Exitoso: ID creado #${data.id}`);
    } catch (err) {
      // En caso de fallo, registra el mensaje de error en la pantalla.
      setCrudResult(`Error: ${err.message}`);
    }
  };

  // 3. UPDATE (PUT)
  // Función asíncrona para simular la actualización total de un registro con ID = 1.
  const handleUpdatePost = async () => {
    try {
      // Notifica al usuario sobre el envío de la actualización.
      setCrudResult('Enviando PUT...');
      // Envía la petición PUT señalando la dirección del recurso específico que se desea modificar (/posts/1).
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'PUT', // Método HTTP para reemplazar completamente el recurso existente.
        headers: { 'Content-Type': 'application/json' }, // Define el tipo de datos adjuntos en las cabeceras.
        body: JSON.stringify({ id: 1, title: 'Post Actualizado', body: 'Nuevo contenido', userId: 1 }), // Nuevos datos a sobrescribir.
      });
      // Comprueba el éxito de la operación en el servidor.
      if (!response.ok) throw new Error('Error al actualizar el recurso');
      // Transforma los datos de respuesta a objeto JSON.
      const data = await response.json();
      // Muestra el título recién modificado que devolvió el servidor.
      setCrudResult(`PUT Exitoso: Título actualizado a "${data.title}"`);
    } catch (err) {
      // Captura y muestra cualquier fallo surgido durante el reemplazo.
      setCrudResult(`Error: ${err.message}`);
    }
  };

  // 4. DELETE (DELETE)
  // Función asíncrona encargada de solicitar el borrado del recurso #1.
  const handleDeletePost = async () => {
    try {
      // Muestra el estado inicial de eliminación en la vista.
      setCrudResult('Enviando DELETE...');
      // Hace la solicitud HTTP DELETE apuntando al recurso #1.
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'DELETE', // Especifica la orden de eliminación del registro.
      });
      // Valida si el servidor aceptó y procesó el borrado de forma correcta.
      if (!response.ok) throw new Error('Error al eliminar el recurso');
      // Imprime el mensaje de éxito una vez eliminada la entidad.
      setCrudResult('DELETE Exitoso: Recurso #1 eliminado correctamente.');
    } catch (err) {
      // Notifica en la interfaz si ocurrió una falla en el proceso de borrado.
      setCrudResult(`Error: ${err.message}`);
    }
  };

  // Bloque de retorno JSX que define toda la estructura visual del componente.
  return (
    // Div contenedor con estilos CSS en línea para establecer un ancho máximo, centrado automático y tipografía.
    <div style={{ maxWidth: '500px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      {/* SECCIÓN 1: POKÉBUSCADOR */}
      {/* Título de la sección principal del buscador */}
      <h2>Buscador (Fetch GET)</h2>
      {/* Formulario que vincula el evento de envío (submit) con la función de búsqueda searchPokemon */}
      <form onSubmit={searchPokemon} style={{ marginBottom: '15px' }}>
        {/* Campo para ingresar el nombre/ID, enlazado bidireccionalmente mediante 'value' y 'onChange' */}
        <input
          type="text"
          placeholder="Ej. pikachu, ditto, 25"
          value={pokemonName}
          // Actualiza el estado 'pokemonName' cada vez que el usuario teclea un nuevo caracter.
          onChange={(e) => setPokemonName(e.target.value)}
          style={{ padding: '8px', width: '65%', marginRight: '5px' }}
        />
        {/* Botón para enviar la búsqueda; se inhabilita automáticamente si 'isLoading' es verdadero */}
        <button type="submit" style={{ padding: '8px 12px' }} disabled={isLoading}>
          Buscar
        </button>
      </form>

      {/* RENDERIZADO CONDICIONAL DE ESTADOS */}
      {/* Muestra un texto con un ícono cuando la petición esté en curso (isLoading == true) */}
      {isLoading && <p style={{ color: '#007bff' }}> Buscando en la PokeAPI...</p>}

      {/* Si existe un mensaje guardado en la variable 'error', renderiza un recuadro de advertencia rojo */}
      {error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Si 'pokemonData' contiene datos de la API, renderiza la tarjeta descriptiva con la información encontrada */}
      {pokemonData && (
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
          {/* Muestra el nombre en mayúsculas y el ID del Pokémon */}
          <h3>{pokemonData.name.toUpperCase()} (#{pokemonData.id})</h3>
          {/* Muestra la imagen (sprite) del Pokémon o una de reemplazo si no está disponible */}
          <img
            src={pokemonData.sprites?.front_default || 'https://via.placeholder.com/120'}
            alt={pokemonData.name}
            style={{ width: '120px', height: '120px' }}
          />
          {/* Mapea y une la lista de tipos del Pokémon separándolos por coma */}
          <p><strong>Tipo:</strong> {pokemonData.types.map((t) => t.type.name).join(', ')}</p>
          {/* Realiza el cálculo matemático para transformar hectogramos/decímetros a kg/m */}
          <p><strong>Peso:</strong> {pokemonData.weight / 10} kg | <strong>Altura:</strong> {pokemonData.height / 10} m</p>
        </div>
      )}

      {/* Separador horizontal entre el buscador y los controles CRUD */}
      <hr style={{ margin: '30px 0' }} />

      {/* SECCIÓN 2: ACTIVIDAD CRUD */}
      {/* Título explicativo para las operaciones de escritura */}
      <h2>Módulo CRUD (JSONPlaceholder)</h2>
      {/* Contenedor flex para organizar horizontalmente los botones del CRUD */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        {/* Botón que ejecuta la función de creación (POST) */}
        <button onClick={handleCreatePost} style={{ padding: '8px 12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          POST (Crear)
        </button>
        {/* Botón que ejecuta la función de actualización (PUT) */}
        <button onClick={handleUpdatePost} style={{ padding: '8px 12px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          PUT (Editar)
        </button>
        {/* Botón que ejecuta la función de eliminación (DELETE) */}
        <button onClick={handleDeletePost} style={{ padding: '8px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          DELETE (Borrar)
        </button>
      </div>

      {/* Renderiza el recuadro informativo solo si existe un resultado almacenado en 'crudResult' */}
      {crudResult && (
        <div style={{ background: '#f8f9fa', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <strong>Respuesta API:</strong> {crudResult}
        </div>
      )}
    </div>
  );
}

// Exporta el componente por defecto para que pueda ser importado fácilmente en index.js o main.jsx.
