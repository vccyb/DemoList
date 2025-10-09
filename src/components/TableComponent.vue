<template>
  <div class="table-container">
    <!-- 新增的图表和统计区域 -->
    <div class="chart-statistics-container">
      <div class="chart-container">
        <div ref="chartRef" class="echart-container"></div>
      </div>
      <div class="statistics-container">
        <div class="statistic-item">
          <div class="statistic-value">{{ completedCount }}</div>
          <div class="statistic-label">已完成</div>
        </div>
        <div class="statistic-item">
          <div class="statistic-value">{{ uncompletedCount }}</div>
          <div class="statistic-label">未完成</div>
        </div>
        <div class="statistic-item">
          <div class="statistic-value">{{ totalItems }}</div>
          <div class="statistic-label">总计</div>
        </div>
      </div>
    </div>

    <el-table :data="paginatedData" style="width: 100%" stripe ref="tableRef">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="date" label="日期" width="120" />
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[30, 50, 100]"
        :small="false"
        :disabled="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalItems"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <div class="button-container">
      <el-button type="primary" @click="exportPdfHtml2Canvas"
        >导出PDF (html2canvas + jsPDF)</el-button
      >
      <el-button type="success" @click="exportPdfPdfLib"
        >导出PDF (PDF-lib)</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from "vue";
// html2canvas + jsPDF 方案
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// PDF-lib 方案
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
// Element Plus 组件
import { ElLoading, ElMessage } from "element-plus";
// ECharts
import * as echarts from "echarts";

// 生成模拟数据
const generateMockData = () => {
  const data = [];
  const names = [
    "张三",
    "李四",
    "王五",
    "赵六",
    "钱七",
    "孙八",
    "周九",
    "吴十",
  ];
  const addresses = [
    "北京市朝阳区xxx街道",
    "上海市浦东新区xxx路",
    "广州市天河区xxx大道",
    "深圳市南山区xxx科技园",
    "杭州市西湖区xxx路",
    "南京市鼓楼区xxx街",
    "成都市锦江区xxx巷",
    "武汉市江汉区xxx广场",
  ];

  // 生成500条模拟数据
  for (let i = 1; i <= 2000; i++) {
    // 随机生成完成状态，70%概率为已完成
    const isCompleted = Math.random() > 0.3;
    data.push({
      id: i,
      name: names[Math.floor(Math.random() * names.length)],
      email: `user${i}@example.com`,
      address: addresses[Math.floor(Math.random() * addresses.length)],
      date: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(
        2,
        "0"
      )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      completed: isCompleted,
    });
  }
  return data;
};

// 数据相关
const tableData = ref(generateMockData());
const currentPage = ref(1);
const pageSize = ref(30);
const totalItems = ref(tableData.value.length);
const tableRef = ref(null);
const chartRef = ref(null);
let chartInstance = null;

// 分页计算属性
const paginatedData = computed(() => {
  // 根据当前页码和每页显示条数计算数据切片范围
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  // 返回当前页需要显示的数据
  return tableData.value.slice(start, end);
});

// 统计数据计算属性
const completedCount = computed(() => {
  return tableData.value.filter((item) => item.completed).length;
});

const uncompletedCount = computed(() => {
  return tableData.value.filter((item) => !item.completed).length;
});

// 分页事件处理
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
};

// 初始化ECharts
const initChart = () => {
  // 确保图表容器存在
  if (chartRef.value) {
    // 初始化ECharts实例
    chartInstance = echarts.init(chartRef.value);
    // 更新图表数据
    updateChart();
  }
};

// 更新图表
const updateChart = () => {
  // 确保ECharts实例存在
  if (chartInstance) {
    // 配置图表选项
    const option = {
      title: {
        text: "任务完成情况",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "任务统计",
          type: "pie",
          radius: "50%",
          data: [
            { value: completedCount.value, name: "已完成" },
            { value: uncompletedCount.value, name: "未完成" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    // 设置图表选项
    chartInstance.setOption(option);
  }
};

// 监听窗口大小变化，重置图表大小
const resizeChart = () => {
  // 确保ECharts实例存在
  if (chartInstance) {
    // 调整图表大小以适应容器
    chartInstance.resize();
  }
};

// 在组件挂载时初始化图表
onMounted(() => {
  // 初始化ECharts图表
  initChart();
  // 添加窗口大小变化监听器
  window.addEventListener("resize", resizeChart);
});

// 当统计数据变化时更新图表
watch([completedCount, uncompletedCount], () => {
  // 更新ECharts图表数据
  updateChart();
});

// html2canvas + jsPDF 导出方案 (改为分页导出)
const exportPdfHtml2Canvas = async () => {
  try {
    // 显示加载提示
    const loading = ElLoading.service({
      lock: true,
      text: "正在导出PDF...",
      background: "rgba(0, 0, 0, 0.7)",
    });

    // 创建 PDF 文档
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // 第一部分：导出ECharts图表和统计数据
    const chartContainer = document.querySelector(
      ".chart-statistics-container"
    );
    let hasChartPage = false;
    if (chartContainer) {
      // 创建临时容器用于截图
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "800px";
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.padding = "20px";

      // 创建标题
      const title = document.createElement("h2");
      title.textContent = "数据统计报告";
      title.style.textAlign = "center";
      title.style.marginBottom = "20px";
      tempContainer.appendChild(title);

      // 创建左右布局容器
      const contentContainer = document.createElement("div");
      contentContainer.style.display = "flex";
      contentContainer.style.gap = "20px";
      contentContainer.style.marginBottom = "20px";

      // 左侧：使用ECharts的getDataURL方法获取图表图片
      const chartWrapper = document.createElement("div");
      chartWrapper.style.flex = "1";
      chartWrapper.style.minWidth = "300px";

      const chartTitle = document.createElement("h3");
      chartTitle.textContent = "任务完成情况";
      chartTitle.style.textAlign = "center";
      chartWrapper.appendChild(chartTitle);

      // 获取ECharts图表的图片数据
      if (chartInstance) {
        const chartImg = document.createElement("img");
        chartImg.src = chartInstance.getDataURL({
          type: "png",
          pixelRatio: 2,
          backgroundColor: "#fff",
        });
        chartImg.style.width = "100%";
        chartWrapper.appendChild(chartImg);
      }

      contentContainer.appendChild(chartWrapper);

      // 右侧：统计数据
      const statsWrapper = document.createElement("div");
      statsWrapper.style.flex = "1";
      statsWrapper.style.minWidth = "200px";
      statsWrapper.style.display = "flex";
      statsWrapper.style.flexDirection = "column";
      statsWrapper.style.justifyContent = "center";
      statsWrapper.style.gap = "20px";

      // 创建统计项目
      const createStatItem = (value, label) => {
        const statItem = document.createElement("div");
        statItem.style.textAlign = "center";
        statItem.style.padding = "15px";
        statItem.style.backgroundColor = "white";
        statItem.style.borderRadius = "8px";
        statItem.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";

        const valueEl = document.createElement("div");
        valueEl.textContent = value;
        valueEl.style.fontSize = "2rem";
        valueEl.style.fontWeight = "bold";
        valueEl.style.color = "#409eff";

        const labelEl = document.createElement("div");
        labelEl.textContent = label;
        labelEl.style.fontSize = "1rem";
        labelEl.style.color = "#666";

        statItem.appendChild(valueEl);
        statItem.appendChild(labelEl);
        return statItem;
      };

      statsWrapper.appendChild(createStatItem(completedCount.value, "已完成"));
      statsWrapper.appendChild(
        createStatItem(uncompletedCount.value, "未完成")
      );
      statsWrapper.appendChild(createStatItem(totalItems.value, "总计"));

      contentContainer.appendChild(statsWrapper);

      tempContainer.appendChild(contentContainer);

      // 添加到页面
      document.body.appendChild(tempContainer);

      // 等待渲染
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 使用 html2canvas 截图
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // 移除临时容器
      document.body.removeChild(tempContainer);

      // 计算图片尺寸
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 40;
      const ratio = imgWidth / canvas.width;
      const imgHeight = canvas.height * ratio;

      // 添加图片到PDF第一页
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        20,
        20,
        imgWidth,
        Math.min(imgHeight, pdfHeight - 40)
      );

      hasChartPage = true;
    }

    // 第二部分：分页导出表格数据
    // 每页显示的数据条数
    const itemsPerPage = 30;
    const totalPages = Math.ceil(tableData.value.length / itemsPerPage);

    // 分页导出表格数据
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      // 添加新页面（除了第一页）
      // 如果已经导出图表页，则从第二页开始添加新页
      // 如果没有图表页，则从第一页开始添加表格内容
      if (pageNum > 0 || hasChartPage) {
        pdf.addPage();
      }

      // 创建临时表格容器
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "800px";
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.padding = "20px";

      // 创建表格标题，显示当前页码和总页数
      const title = document.createElement("h2");
      title.textContent = `数据表格导出 (第 ${
        pageNum + 1
      } 页 共 ${totalPages} 页)`;
      title.style.textAlign = "center";
      title.style.marginBottom = "20px";
      tempContainer.appendChild(title);

      // 创建表格
      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.fontSize = "12px";

      // 创建表头
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      const headers = ["ID", "姓名", "邮箱", "地址", "日期"];
      headers.forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;
        th.style.border = "1px solid #ddd";
        th.style.padding = "8px";
        th.style.backgroundColor = "#f5f5f5";
        th.style.fontWeight = "bold";
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // 创建表体
      const tbody = document.createElement("tbody");
      // 计算当前页需要显示的数据范围
      const start = pageNum * itemsPerPage;
      const end = Math.min(start + itemsPerPage, tableData.value.length);

      // 遍历当前页的数据并添加到表格中
      for (let i = start; i < end; i++) {
        const item = tableData.value[i];
        const row = document.createElement("tr");

        // ID
        const idCell = document.createElement("td");
        idCell.textContent = item.id;
        idCell.style.border = "1px solid #ddd";
        idCell.style.padding = "8px";
        row.appendChild(idCell);

        // 姓名
        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;
        nameCell.style.border = "1px solid #ddd";
        nameCell.style.padding = "8px";
        row.appendChild(nameCell);

        // 邮箱
        const emailCell = document.createElement("td");
        emailCell.textContent = item.email;
        emailCell.style.border = "1px solid #ddd";
        emailCell.style.padding = "8px";
        row.appendChild(emailCell);

        // 地址
        const addressCell = document.createElement("td");
        addressCell.textContent = item.address;
        addressCell.style.border = "1px solid #ddd";
        addressCell.style.padding = "8px";
        row.appendChild(addressCell);

        // 日期
        const dateCell = document.createElement("td");
        dateCell.textContent = item.date;
        dateCell.style.border = "1px solid #ddd";
        dateCell.style.padding = "8px";
        row.appendChild(dateCell);

        tbody.appendChild(row);
      }

      table.appendChild(tbody);
      tempContainer.appendChild(table);

      // 添加页脚，显示当前页码
      const footer = document.createElement("div");
      footer.textContent = `第 ${pageNum + 1} 页 共 ${totalPages} 页`;
      footer.style.textAlign = "center";
      footer.style.marginTop = "20px";
      footer.style.fontSize = "10px";
      tempContainer.appendChild(footer);

      // 添加到页面
      document.body.appendChild(tempContainer);

      // 等待渲染
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 使用 html2canvas 截图
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // 移除临时容器
      document.body.removeChild(tempContainer);

      // 计算图片尺寸
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 40;
      const ratio = imgWidth / canvas.width;
      const imgHeight = canvas.height * ratio;

      // 添加图片到PDF
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.95),
        "JPEG",
        20,
        20,
        imgWidth,
        Math.min(imgHeight, pdfHeight - 40)
      );
    }

    // 保存 PDF 文件
    pdf.save("table-export-html2canvas.pdf");

    // 关闭加载提示
    loading.close();
    ElMessage.success("PDF 导出成功！");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("PDF 导出失败：" + error.message);
  }
};

// PDF-lib 导出方案
const exportPdfPdfLib = async () => {
  try {
    // 显示加载提示
    const loading = ElLoading.service({
      lock: true,
      text: "正在导出PDF...",
      background: "rgba(0, 0, 0, 0.7)",
    });

    // 创建新的 PDF 文档
    const pdfDoc = await PDFDocument.create();

    // 注册 fontkit
    pdfDoc.registerFontkit(fontkit);

    // 第一部分：创建首页，包含ECharts图表的文本描述和统计数据
    let page = pdfDoc.addPage([600, 800]);
    let yPosition = 750;

    // 添加标题
    page.drawText("数据统计报告", {
      x: 200,
      y: yPosition,
      size: 18,
      color: rgb(0, 0, 0),
    });

    yPosition -= 50;

    // 添加统计信息
    page.drawText(`已完成任务: ${completedCount.value}`, {
      x: 50,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 0),
    });

    yPosition -= 30;

    page.drawText(`未完成任务: ${uncompletedCount.value}`, {
      x: 50,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 0),
    });

    yPosition -= 30;

    page.drawText(`总任务数: ${totalItems.value}`, {
      x: 50,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 0),
    });

    yPosition -= 40;

    // 添加饼图数据说明
    page.drawText("任务完成情况分布:", {
      x: 50,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 0),
    });

    yPosition -= 30;

    // 计算百分比
    const completedPercent = Math.round(
      (completedCount.value / totalItems.value) * 100
    );
    const uncompletedPercent = Math.round(
      (uncompletedCount.value / totalItems.value) * 100
    );

    page.drawText(`已完成: ${completedCount.value} (${completedPercent}%)`, {
      x: 70,
      y: yPosition,
      size: 12,
      color: rgb(0, 0.6, 0), // 绿色
    });

    yPosition -= 25;

    page.drawText(
      `未完成: ${uncompletedCount.value} (${uncompletedPercent}%)`,
      {
        x: 70,
        y: yPosition,
        size: 12,
        color: rgb(0.8, 0, 0), // 红色
      }
    );

    yPosition -= 40;

    // 添加可视化图表说明
    page.drawText("饼图示意:", {
      x: 50,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 0),
    });

    yPosition -= 30;

    // 绘制简易饼图示意（使用圆形和扇形表示）
    const centerX = 100;
    const centerY = yPosition - 50;
    const radius = 40;

    // 绘制外圆
    page.drawCircle({
      x: centerX,
      y: centerY,
      size: radius,
      color: rgb(0.9, 0.9, 0.9),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    // 绘制已完成部分的扇形（简化表示）
    const completedAngle = (completedCount.value / totalItems.value) * 360;
    page.drawCircle({
      x: centerX,
      y: centerY,
      size: radius,
      color: rgb(0.2, 0.6, 1), // 蓝色表示已完成
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    // 添加图例
    yPosition -= 100;

    page.drawText("图例:", {
      x: 50,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });

    // 已完成图例
    page.drawRectangle({
      x: 70,
      y: yPosition - 20,
      width: 15,
      height: 15,
      color: rgb(0.2, 0.6, 1),
    });
    page.drawText("已完成", {
      x: 90,
      y: yPosition - 18,
      size: 10,
      color: rgb(0, 0, 0),
    });

    // 未完成图例
    page.drawRectangle({
      x: 150,
      y: yPosition - 20,
      width: 15,
      height: 15,
      color: rgb(0.9, 0.9, 0.9),
    });
    page.drawText("未完成", {
      x: 170,
      y: yPosition - 18,
      size: 10,
      color: rgb(0, 0, 0),
    });

    // 第二部分：分页导出表格数据
    // 创建第二页用于表格数据
    page = pdfDoc.addPage([600, 800]);
    yPosition = 750;

    // 添加表格标题
    page.drawText("数据表格导出 (Data Table Export)", {
      x: 50,
      y: yPosition,
      size: 18,
      color: rgb(0, 0, 0),
    });

    yPosition -= 30;

    // 添加表头
    const headers = [
      "ID",
      "Name(姓名)",
      "Email(邮箱)",
      "Address(地址)",
      "Date(日期)",
    ];
    headers.forEach((header, index) => {
      page.drawText(header, {
        x: 50 + index * 100,
        y: yPosition,
        size: 12,
        color: rgb(0, 0, 0),
      });
    });

    yPosition -= 20;

    // 添加表格数据（分批处理，避免一页放不下）
    for (let i = 0; i < tableData.value.length; i++) {
      const item = tableData.value[i];

      // 如果当前页面空间不足，创建新页面
      if (yPosition < 50) {
        page = pdfDoc.addPage([600, 800]);
        yPosition = 750;

        // 重新添加表头
        headers.forEach((header, index) => {
          page.drawText(header, {
            x: 50 + index * 100,
            y: yPosition,
            size: 12,
            color: rgb(0, 0, 0),
          });
        });

        yPosition -= 20;
      }

      // 绘制数据行
      page.drawText(item.id.toString(), {
        x: 50,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });

      page.drawText(item.name, {
        x: 150,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });

      page.drawText(item.email, {
        x: 250,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });

      // 地址可能较长，需要截断
      const address =
        item.address.length > 20
          ? item.address.substring(0, 20) + "..."
          : item.address;
      page.drawText(address, {
        x: 350,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });

      page.drawText(item.date, {
        x: 450,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });

      yPosition -= 20;

      // 每50行添加一个分页提示（可选）
      if ((i + 1) % 50 === 0 && i !== tableData.value.length - 1) {
        page.drawText(
          `Page ${Math.ceil((i + 1) / 50)} 第${Math.ceil((i + 1) / 50)}页`,
          {
            x: 500,
            y: 30,
            size: 8,
            color: rgb(0, 0, 0),
          }
        );
      }
    }

    // 添加页脚
    const pages = pdfDoc.getPages();
    pages.forEach((page, index) => {
      page.drawText(
        `Page ${index + 1} of ${pages.length} (第${index + 1}页 共${
          pages.length
        }页)`,
        {
          x: 50,
          y: 20,
          size: 8,
          color: rgb(0, 0, 0),
        }
      );
    });

    // 保存 PDF
    const pdfBytes = await pdfDoc.save();

    // 创建下载链接
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table-export-pdflib.pdf";
    link.click();

    // 关闭加载提示
    loading.close();
    ElMessage.success("PDF 导出成功！");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("PDF 导出失败：" + error.message);
  }
};
</script>

<style scoped>
.table-container {
  padding: 20px;
}

/* 新增的图表和统计区域样式 */
.chart-statistics-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.chart-container {
  flex: 1;
  min-width: 300px;
}

.echart-container {
  width: 100%;
  height: 300px;
}

.statistics-container {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.statistic-item {
  text-align: center;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.statistic-value {
  font-size: 2rem;
  font-weight: bold;
  color: #409eff;
}

.statistic-label {
  font-size: 1rem;
  color: #666;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-statistics-container {
    flex-direction: column;
  }

  .chart-container,
  .statistics-container {
    min-width: 100%;
  }
}
</style>
