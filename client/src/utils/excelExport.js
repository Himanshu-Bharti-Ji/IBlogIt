import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Function to convert image URL to base64
const imageToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

// Export posts to Excel with images
export const exportPostsToExcel = async (posts) => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Prepare data for Excel
    const excelData = await Promise.all(
      posts.map(async (post, index) => {
        // Convert image to base64
        const imageBase64 = await imageToBase64(post.image);

        return {
          "S.No": index + 1,
          "Date Updated": new Date(post.updatedAt).toLocaleDateString(),
          "Post Title": post.title.replace(/<[^>]*>/g, ""), // Remove HTML tags
          "Category": post.category,
          "Image URL": post.image,
          "Image": imageBase64 ? `IMAGE:${imageBase64}` : "No Image",
        };
      })
    );

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws["!cols"] = [
      { wch: 8 },  // S.No
      { wch: 15 }, // Date Updated
      { wch: 40 }, // Post Title
      { wch: 15 }, // Category
      { wch: 50 }, // Image URL
      { wch: 30 }, // Image
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Posts");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Save file
    const fileName = `posts_export_${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw error;
  }
};

// Alternative: Export with images as separate column (simpler approach)
export const exportPostsToExcelSimple = async (posts) => {
  try {
    const wb = XLSX.utils.book_new();

    const excelData = posts.map((post, index) => ({
      "S.No": index + 1,
      "Date Updated": new Date(post.updatedAt).toLocaleDateString(),
      "Post Title": post.title.replace(/<[^>]*>/g, ""),
      "Category": post.category,
      "Image URL": post.image,
      "Slug": post.slug,
      "Created At": new Date(post.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws["!cols"] = [
      { wch: 8 },
      { wch: 15 },
      { wch: 50 },
      { wch: 15 },
      { wch: 60 },
      { wch: 30 },
      { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Posts");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `posts_export_${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw error;
  }
};

