const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  notes.push({
    id, title, createdAt, updatedAt, tags, body,
  });

  const isSuccess = notes.filter((note) => note.id === id).length === 1;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    }).header('Content-Type', 'application/json').code(201);
  }

  return h.response({
    status: 'error',
    message: 'Catatan gagal untuk ditambahkan',
  }).header('Content-Type', 'application/json').code(500);
};

const getAllNotesHandler = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      notes,
    },
  });

  response.header('Content-Type', 'application/json').code(200);

  return response;
};

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id);

  if (note.length === 1 && note[0]) {
    return h.response({
      status: 'success',
      data: {
        note: note[0],
      },
    }).header('Content-Type', 'application/json').code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  }).header('Content-Type', 'application/json').code(404);
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((n) => n.id === id);

  if (index !== -1) {
    notes[index].title = title;
    notes[index].tags = tags;
    notes[index].body = body;
    notes[index].updatedAt = updatedAt;

    return h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    }).header('Content-Type', 'application/json').code(200);
  }

  return JSON.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  }).header('Content-Type', 'application/json').code(404);
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((n) => n.id === id);

  if (index !== -1) {
    notes.splice(index, 1);

    return h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    }).header('Content-Type', 'application/json').code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  }).header('Content-Type', 'application/json').code(404);
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
