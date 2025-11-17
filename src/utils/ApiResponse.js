export class ApiResponse {
  static ok(res, data, message) {
    return res.status(200).json({ success: true, message, data });
  }

  static created(res, data, message) {
    return res.status(201).json({ success: true, message, data });
  }

  static error(res, message, status = 500) {
    return res.status(status).json({ success: false, message });
  }
}
