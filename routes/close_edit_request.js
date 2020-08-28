function closeEditRequest(req, res) {

}

wiki.post('/admin/thread/:slug/close', closeEditRequest);
wiki.post('/edit_request/:slug/close', closeEditRequest);  // 나무픽스 호환