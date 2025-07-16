export default () => {
  return async (
    ctx: {
      request: { files: { deliveryFile: any[]; file: any } };
      badRequest: (arg0: string) => any;
    },
    next: () => any
  ) => {
    strapi.log.info('=== VALIDATE FILE UPLOAD START ===');

    try {
      // Sprawdź czy plik został przesłany
      if (!ctx.request.files || !ctx.request.files.deliveryFile) {
        // Sprawdź też alternatywną nazwę 'file'
        if (!ctx.request.files?.file) {
          strapi.log.error('No file found in request');
          return ctx.badRequest('Brak pliku do przesłania');
        }
        // Jeśli plik jest pod nazwą 'file', przypisz go do deliveryFile
        ctx.request.files.deliveryFile = ctx.request.files.file;
      }

      const file = Array.isArray(ctx.request.files.deliveryFile)
        ? ctx.request.files.deliveryFile[0]
        : ctx.request.files.deliveryFile;

      // Walidacja typu pliku
      const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/vnd.ms-excel.sheet.macroEnabled.12', // .xlsm
        'application/zip', // .xlsm może być wykrywany jako ZIP
        'text/csv', // .csv
        'application/csv', // .csv (alternative)
      ];

      const allowedExtensions = ['.xlsx', '.xls', '.xlsm', '.csv'];

      // Pobierz nazwę pliku
      const fileName =
        file.name ||
        file.originalName ||
        file.filename ||
        file.originalFilename;

      if (!fileName || typeof fileName !== 'string') {
        strapi.log.error('Invalid file name');
        return ctx.badRequest('Nazwa pliku jest nieprawidłowa');
      }

      const fileExtension = fileName
        .toLowerCase()
        .slice(fileName.lastIndexOf('.'));
      const mimeType = file.type || file.mimetype;

      // Sprawdź rozszerzenie
      if (!allowedExtensions.includes(fileExtension)) {
        strapi.log.error('Invalid file extension', { fileExtension });
        return ctx.badRequest(
          `Nieprawidłowy format pliku. Obsługiwane formaty: .xlsx, .xls, .xlsm, .csv. Wykryto: ${fileExtension}`
        );
      }

      // Sprawdź MIME type (ale pozwól na pliki .xls bez właściwego MIME)
      if (
        mimeType &&
        !allowedMimeTypes.includes(mimeType) &&
        fileExtension !== '.xls'
      ) {
        strapi.log.warn('Unusual MIME type', { mimeType, fileExtension });
      }

      // Walidacja rozmiaru pliku (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      const fileSize = file.size;

      if (!fileSize || typeof fileSize !== 'number' || fileSize > maxSize) {
        return ctx.badRequest(
          `Plik jest zbyt duży. Maksymalny rozmiar to 10MB. Rozmiar pliku: ${
            fileSize ? (fileSize / 1024 / 1024).toFixed(2) + 'MB' : 'nieznany'
          }`
        );
      }

      // Sprawdź czy nazwa pliku zawiera niebezpieczne znaki
      const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
      if (dangerousChars.test(fileName)) {
        strapi.log.warn('File name contains dangerous characters', {
          fileName,
        });
        return ctx.badRequest('Nazwa pliku zawiera niedozwolone znaki');
      }

      strapi.log.info('File validation passed', {
        fileName,
        fileSize: (fileSize / 1024 / 1024).toFixed(2) + 'MB',
        mimeType,
        extension: fileExtension,
      });

      strapi.log.info('=== VALIDATE FILE UPLOAD END - SUCCESS ===');
      await next();
    } catch (error) {
      strapi.log.error('=== VALIDATE FILE UPLOAD END - ERROR ===', error);
      throw error;
    }
  };
};
