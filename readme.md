## YÊU CẦU TRIỂN KHAI WEBSITE

Website phải được thiết kế để có thể lưu toàn bộ source code trên GitHub và tự động build/deploy bằng GitHub Actions lên GitHub Pages.

### Công nghệ bắt buộc

Sử dụng:

* React
* TypeScript
* Vite
* Tailwind CSS
* React Flow hoặc @xyflow/react để trực quan hóa graph
* Lucide React cho icon
* Framer Motion nếu cần animation
* npm làm package manager

Không sử dụng backend.

Không yêu cầu:

* Node.js server chạy liên tục
* PHP
* MySQL
* MongoDB
* Firebase

Toàn bộ BFS, DFS, Queue, Stack, Graph Editor và visualization phải chạy trực tiếp trên trình duyệt.

---

## CẤU TRÚC PROJECT

Tổ chức project rõ ràng:

src/
├── components/
│   ├── graph/
│   │   ├── GraphCanvas.tsx
│   │   ├── GraphNode.tsx
│   │   ├── GraphEdge.tsx
│   │   └── GraphControls.tsx
│   │
│   ├── algorithm/
│   │   ├── AlgorithmControls.tsx
│   │   ├── QueueVisualizer.tsx
│   │   ├── StackVisualizer.tsx
│   │   ├── TraversalOrder.tsx
│   │   └── PseudocodeViewer.tsx
│   │
│   ├── tables/
│   │   ├── AdjacencyList.tsx
│   │   ├── AdjacencyMatrix.tsx
│   │   ├── BFSStepsTable.tsx
│   │   └── DFSStepsTable.tsx
│   │
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── AlgorithmPanel.tsx
│
├── algorithms/
│   ├── bfs.ts
│   ├── dfs.ts
│   ├── adjacency.ts
│   └── graphUtils.ts
│
├── types/
│   └── graph.ts
│
├── hooks/
│   └── useAlgorithmPlayer.ts
│
├── data/
│   └── examples.ts
│
├── App.tsx
└── main.tsx

Các thuật toán BFS/DFS phải được tách khỏi component giao diện.

---

# GITHUB PAGES

Website phải tương thích hoàn toàn với GitHub Pages.

Giả sử repository có tên:

graph-traversal-visualizer

URL website có dạng:

https://USERNAME.github.io/graph-traversal-visualizer/

Không được hard-code đường dẫn `/`.

Cấu hình Vite `base` phù hợp với GitHub Pages.

Ví dụ trong vite.config.ts:

export default defineConfig({
plugins: [react()],
base: '/graph-traversal-visualizer/'
})

Hoặc tốt hơn:

cho phép base path được cấu hình thông qua environment variable để dễ thay đổi tên repository.

---

# GITHUB ACTIONS

Tạo file:

.github/workflows/deploy.yml

Workflow phải:

1. Trigger khi push vào branch main.
2. Checkout source code.
3. Setup Node.js.
4. Cài dependencies bằng npm ci.
5. Build project bằng npm run build.
6. Upload thư mục dist.
7. Deploy dist lên GitHub Pages.

Sử dụng GitHub Pages Actions chính thức.

Workflow cần có permissions phù hợp:

permissions:
contents: read
pages: write
id-token: write

Concurrency:

group: pages
cancel-in-progress: true

Workflow phải chạy được trực tiếp sau khi push source lên GitHub.

---

# PACKAGE.JSON

Phải có tối thiểu:

npm run dev

npm run build

npm run preview

npm run lint

Build production không được có lỗi TypeScript.

---

# README

Tạo README.md đầy đủ.

Bao gồm:

# Graph Traversal Visualizer

Website trực quan hóa BFS và DFS phục vụ học tập môn Cấu trúc dữ liệu và Giải thuật / Lý thuyết đồ thị.

## Features

* Graph Editor
* Directed / Undirected Graph
* Adjacency List
* Adjacency Matrix
* BFS Visualization
* DFS Visualization
* Queue Visualization
* Stack Visualization
* BFS Tree
* DFS Tree
* Step-by-step Algorithm
* Previous / Next
* Play / Pause
* Speed Control
* Python Code Generation
* Light / Dark Mode

## Development

npm install

npm run dev

## Build

npm run build

## Deployment

Website được tự động deploy lên GitHub Pages bằng GitHub Actions.

---

# LƯU TRỮ DỮ LIỆU

Không cần database.

Sử dụng localStorage để lưu:

* Graph hiện tại
* Tập đỉnh
* Tập cạnh
* Loại graph
* Đỉnh bắt đầu
* Quy tắc sắp xếp
* Tên đề tài

Khi người dùng F5 hoặc đóng trình duyệt rồi mở lại, graph trước đó vẫn còn.

Có nút:

"Lưu đồ thị"

"Khôi phục"

"Xóa dữ liệu"

---

# IMPORT / EXPORT GRAPH

Cho phép Export graph thành JSON.

Ví dụ:

{
"name": "Smart Campus",
"directed": false,
"vertices": [
"Data Center",
"Building A",
"Building B",
"Lab"
],
"edges": [
["Data Center", "Building A"],
["Data Center", "Building B"],
["Building A", "Lab"]
],
"startVertex": "Data Center",
"neighborOrder": "ascending"
}

Có nút:

Export JSON

Import JSON

Nhờ đó sinh viên có thể lưu đồ thị Tuần 6 mà không cần database.

---

# ROUTING

Nếu website chỉ có một trang chính:

Ưu tiên Single Page Application đơn giản và không cần React Router.

Nếu sử dụng React Router, phải xử lý refresh URL trên GitHub Pages để không xuất hiện lỗi 404.

Ưu tiên thiết kế các phần BFS, DFS, Graph và Report dưới dạng tab/component trong cùng một SPA.

---

# YÊU CẦU BUILD

Trước khi hoàn thành project phải đảm bảo:

npm install

npm run build

chạy thành công.

Không được để:

* TypeScript error
* missing dependency
* broken import
* ESLint critical error
* asset path bị sai
* blank page sau khi deploy GitHub Pages

Website phải hoạt động cả khi chạy:

npm run dev

và khi được deploy trong subdirectory của GitHub Pages.

---

# GITHUB ACTIONS DEPLOYMENT

Project hoàn thành phải chứa:

.github/
└── workflows/
└── deploy.yml

Sau khi push:

git add .

git commit -m "Deploy Graph Traversal Visualizer"

git push origin main

GitHub Actions phải tự động:

Install
↓
Build
↓
Upload Artifact
↓
Deploy GitHub Pages

Không yêu cầu người dùng build thủ công rồi upload thư mục dist.

---

# MỤC TIÊU CUỐI CÙNG

Repository phải ở trạng thái:

Clone repository
↓
npm install
↓
npm run dev

là chạy được ngay.

Và:

Push main
↓
GitHub Actions
↓
npm ci
↓
npm run build
↓
GitHub Pages

Website online tự động.

Toàn bộ BFS/DFS chạy phía client nên website phải hoạt động hoàn chỉnh trên GitHub Pages mà không cần backend.
