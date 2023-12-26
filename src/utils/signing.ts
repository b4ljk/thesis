/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
// export function addVisual(pdf: any): [number, number, number, number] {
//   // Go to first page
//   pdf.switchToPage(0);

//   const margin = 30;
//   const padding = 10;
//   const label = "Signer label img";
//   pdf.fillColor("#008B93").fontSize(10);

//   const text = {
//     width: pdf.widthOfString(label),
//     height: pdf.heightOfString(label),
//   };

//   text.x = pdf.page.width - text.width - margin;
//   text.y = pdf.page.height - text.height - margin;

//   pdf.text(label, text.x, text.y, { width: text.width, height: text.height });

//   return [
//     text.x - padding,
//     text.y - padding,
//     text.x + text.width + padding,
//     text.y + text.height + padding,
//   ];
// }
