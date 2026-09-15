# Graph Traversal Visualizer

Website trực quan hóa BFS và DFS phục vụ học tập môn Cấu trúc dữ liệu và Giải thuật / Lý thuyết đồ thị. React + TypeScript + Vite + Tailwind CSS + React Flow, Lucide và Framer Motion. Chạy hoàn toàn trên trình duyệt, không cần backend.

## Features

- Graph Editor: thêm, kéo, nối và xóa đỉnh/cạnh; đồ thị mẫu và ngẫu nhiên.
- Directed / Undirected Graph; đỉnh bắt đầu và thứ tự đỉnh kề A–Z / Z–A.
- Adjacency List, Adjacency Matrix.
- BFS Visualization, DFS Visualization; màu trạng thái, tầng BFS và phân loại cạnh DFS.
- Queue Visualization, Stack Visualization.
- BFS Tree, DFS Tree xuất hiện theo tiến trình.
- Step-by-step Algorithm, Previous / Next, Play / Pause, Reset, Finish, Speed Control.
- Bản chụp độc lập cho mọi bước: đồ thị, stack/queue, thứ tự duyệt, giải thích và dòng mã.
- Python Code Generation theo đồ thị và thứ tự đỉnh kề hiện tại.
- Light / Dark Mode, tiếng Việt / English.
- Chế độ học: dự đoán đỉnh tiếp theo bằng cách nhấn đỉnh trên canvas.
- Tự lưu đồ thị hiện tại bằng localStorage; Lưu, Khôi phục và Xóa dữ liệu trong tùy chọn nâng cao.
- Import / Export JSON; nhập edge list hoặc adjacency list.

## Development

Yêu cầu Node.js 22 trở lên và npm.

Trên máy đang tạo dự án, có thể chạy `start-local.cmd` để dùng Node.js portable đã chuẩn bị ở thư mục cha.

```sh
npm install
npm run dev
```

## Build

```sh
npm run lint
npm test
npm run build
npm run preview
```

`dist/` là toàn bộ website tĩnh. Không mở `index.html` bằng `file://`; dùng `npm run preview` hoặc static host.

## Deployment

Website được tự động deploy lên GitHub Pages bằng GitHub Actions.

1. Tạo repository, ví dụ `graph-traversal-visualizer`.
2. Đưa **nội dung thư mục dự án này** (nơi chứa `package.json` và `.github/`) vào gốc repository.
3. Trong GitHub repository, vào **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Push branch `main`:

```sh
git add .
git commit -m "Deploy Graph Traversal Visualizer"
git branch -M main
git remote add origin https://github.com/USERNAME/graph-traversal-visualizer.git
git push -u origin main
```

Nếu đã có remote `origin`, bỏ lệnh `git remote add`.

Workflow `.github/workflows/deploy.yml` tự chạy npm ci → lint → test → build → upload dist → deploy. URL xuất hiện trong trang Actions và Settings → Pages, thường là `https://USERNAME.github.io/graph-traversal-visualizer/`.

Tham khảo [hướng dẫn workflow GitHub Pages chính thức](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Vite mặc định `base: './'`; workflow lấy `base_path` từ GitHub Pages và truyền `VITE_BASE_PATH` nên hỗ trợ tên repository khác, user pages và custom domain. Có thể tự đặt biến môi trường `VITE_BASE_PATH=/ten-repository/` khi build. Website dùng tab trong một SPA, không có lỗi refresh do route con.

## Cách sử dụng

Chọn DFS/BFS → chọn đỉnh bắt đầu → Play. Các đỉnh kề mặc định xét A–Z. Chỉ thành phần đi tới được từ đỉnh bắt đầu được duyệt; kết quả cuối ghi số đỉnh đã tới trên tổng số đỉnh.

- Công cụ **Thêm đỉnh**: nhấn vùng trống. Tối đa 30 đỉnh để dễ quan sát.
- **Thêm phần tử (đỉnh)**: nhập tên tùy chọn trong bảng Chỉnh sửa đồ thị, nhấn Enter hoặc **Thêm vào đồ thị**. Hỗ trợ tên có khoảng trắng, tối đa 40 ký tự; tên không được trùng. Đỉnh mới được đặt vào vị trí trống, tự lưu và có thể nối bằng công cụ Thêm cạnh.
- **Thêm cạnh**: nhấn đỉnh nguồn rồi đỉnh đích; hoặc kéo giữa chấm kết nối của hai đỉnh.
- **Di chuyển**: kéo đỉnh, kéo nền để pan, cuộn để zoom.
- **Xóa**: nhấn đỉnh/cạnh; hoặc chọn đối tượng rồi nhấn Delete.
- Chỉnh sửa đồ thị hay đổi cấu hình sẽ đặt lại tiến trình.
- Cây BFS/DFS là các cạnh cây của lượt duyệt hiện tại, giữ nguyên vị trí đỉnh để tiện đối chiếu.
- Bảng bước chứa các bước đã thực hiện. Nhấn Finish để xem toàn bộ.
- L0, L1… là độ sâu cây duyệt; với BFS cũng là khoảng cách theo số cạnh từ đỉnh bắt đầu.
- Vô hướng: bỏ qua cạnh về cha khi phân loại DFS. Self-loop được tính là cạnh ngược.

Phím tắt: Space = Play/Pause, ←/→ = Previous/Next, R = Reset. Phím tắt không can thiệp khi nhập liệu hoặc đang focus nút.

## Lưu trữ & JSON

Dữ liệu nằm trong trình duyệt hiện tại, không đồng bộ giữa thiết bị. Export JSON để chia sẻ hoặc sao lưu. Xóa dữ liệu sẽ xóa cả đồ thị hiện tại lẫn bản lưu thủ công; theme/ngôn ngữ được giữ lại.

```json
{
  "name": "Smart Campus",
  "directed": false,
  "vertices": ["Data Center", "Building A", "Building B", "Lab"],
  "edges": [
    ["Data Center", "Building A"],
    ["Data Center", "Building B"],
    ["Building A", "Lab"]
  ],
  "startVertex": "Data Center",
  "neighborOrder": "ascending"
}
```

JSON hỗ trợ tên đỉnh 1–40 ký tự, có khoảng trắng; `positions` là trường tùy chọn để lưu vị trí. Edge list / adjacency list hỗ trợ nhãn 1–8 ký tự gồm chữ Latin, số và `_`. Đỉnh cô lập có thể nhập bằng một nhãn trên một dòng hoặc `A:`. Cạnh trùng được loại khi import.

## Cấu trúc

`src/algorithms/` chứa DFS/BFS, tạo đồ thị, chuyển đổi JSON và danh sách kề; không phụ thuộc React. `src/hooks/` điều khiển playback. `src/components/graph/`, `algorithm/`, `tables/`, `layout/` chứa giao diện. `tests/` kiểm tra thứ tự duyệt, chu trình, trạng thái stack/queue, snapshot và dữ liệu nhập.

Thuật toán cơ bản có thời gian O(V + E), bộ nhớ O(V). Bộ mô phỏng bổ sung chi phí sắp xếp đỉnh kề và sao chép trạng thái cho từng bước để hỗ trợ Previous; bộ nhớ thực tế lớn hơn thuật toán cơ bản.
