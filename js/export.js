document.getElementById("exportToExcel").addEventListener("click", () => {
    // Obtén la tabla por su ID
    const table = document.getElementById("table");

    // Convierte la tabla a un formato de hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table);

    // Añade la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");

    // Guarda el archivo Excel
    XLSX.writeFile(workbook, "clientes.xlsx");
  });