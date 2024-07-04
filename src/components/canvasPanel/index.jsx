import frontImg from "@/assets/front-blank.png";
import backImg from "@/assets/back-blank.png";
import avatarImg from "@/assets/avatar.png";
import backTextImg from "@/assets/back-text.png";
import backIconImg from "@/assets/back-icon.png";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import "./index.less";
const CanvasPanel = forwardRef(({ cardInfo }, ref) => {
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const createText = (ctx, text, options) => {
    const {
      fontSize = 20,
      color = "#000000",
      fontWeight = 0,
      letterSpacing = 10,
      x = 0,
      y = 0,
    } = options;
    ctx.font = `${fontSize}px SimHei`;

    // 设定填充文字的颜色
    ctx.fillStyle = color;
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], x + i * letterSpacing, y);
      ctx.fillText(text[i], x + fontWeight + i * letterSpacing, y + fontWeight);
    }
  };
  useEffect(() => {
    if (cardInfo) {
      generateIdcardFront();
      generateIdcardBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardInfo]);
  // 字符串截取为段
  const splitText = (text, segmentLength) => {
    const parts = [];
    for (let i = 0; i < text.length; i += segmentLength) {
      parts.push(text.slice(i, i + segmentLength));
    }
    return parts;
  };
  const generateTitle = (ctx) => {
    const titleOptions = {
      fontSize: 12.5,
      color: "#489fb3",
      fontWeight: 0.1,
      letterSpacing: 22,
    };
    createText(ctx, "姓名", { ...titleOptions, x: 105, y: 105 });
    createText(ctx, "性别", { ...titleOptions, x: 105, y: 140 });
    createText(ctx, "民族", { ...titleOptions, x: 205, y: 140 });
    createText(ctx, "民族", { ...titleOptions, x: 205, y: 140 });
    createText(ctx, "出生", { ...titleOptions, x: 105, y: 175 });
    createText(ctx, "年", { ...titleOptions, x: 205, y: 175 });
    createText(ctx, "月", { ...titleOptions, x: 245, y: 175 });
    createText(ctx, "日", { ...titleOptions, x: 290, y: 175 });
    createText(ctx, "住址", { ...titleOptions, x: 105, y: 210 });
    createText(ctx, "公民身份证号码", {
      ...titleOptions,
      x: 105,
      y: 295,
      letterSpacing: 14.3,
    });
  };
  const generateInfo = (ctx) => {
    const { name, sex, year, month, day, address, idcard, nation } = cardInfo;
    const contentOptions = {
      fontSize: 14.5,
      color: "#000000",
      fontWeight: 0,
      letterSpacing: 20,
    };
    createText(ctx, name, {
      ...contentOptions,
      fontSize: 16.5,
      x: 150,
      y: 105,
    });
    createText(ctx, sex, { ...contentOptions, x: 150, y: 140 });
    createText(ctx, nation, { ...contentOptions, x: 246, y: 140 });
    createText(ctx, year, {
      ...contentOptions,
      x: 150,
      y: 175,
      letterSpacing: 9,
    });
    createText(ctx, month, {
      ...contentOptions,
      x: 225,
      y: 175,
      letterSpacing: 9,
    });
    createText(ctx, day, {
      ...contentOptions,
      x: 265,
      y: 175,
      letterSpacing: 9,
    });
    splitText(address, 11).forEach((item, index) => {
      createText(ctx, item, {
        ...contentOptions,
        x: 150,
        y: 210 + index * 20,
        letterSpacing: 16,
      });
    });
    createText(ctx, idcard, {
      ...contentOptions,
      x: 220,
      y: 295,
      letterSpacing: 13.5,
      fontSize: 16,
      fontWeight: 0.3,
    });
  };
  const generateIdcardFront = () => {
    const canvas = frontRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    const avatar = new Image();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      generateTitle(ctx);
      generateInfo(ctx);
      avatar.src = avatarImg;
    };
    avatar.onload = () => {
      ctx.drawImage(avatar, 370, 100, 116, 150);
    };
    image.src = frontImg;
  };
  const generateIdcardBack = () => {
    const canvas = backRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    const backText = new Image();
    const backIcon = new Image();
    const { unit, validityPeriod } = cardInfo;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      const titleOptions = {
        fontSize: 12.5,
        fontWeight: 0.3,
        letterSpacing: 15,
      };
      createText(ctx, "签发机关", { ...titleOptions, x: 170, y: 280 });
      createText(ctx, "有效期限", { ...titleOptions, x: 170, y: 312 });
      createText(ctx, unit, {
        fontSize: 14,
        fontWeight: 0.1,
        letterSpacing: 15,
        x: 250,
        y: 280,
      });
      createText(ctx, validityPeriod, {
        fontSize: 14,
        fontWeight: 0.1,
        letterSpacing: 8,
        x: 250,
        y: 312,
      });
      backText.src = backTextImg;
      backIcon.src = backIconImg;
    };
    backText.onload = () => {
      ctx.drawImage(backText, 194, 80, 300, 100);
    };
    backIcon.onload = () => {
      ctx.drawImage(backIcon, 90, 85, 95, 95);
    };
    image.src = backImg;
  };
  const saveAs = (blob, filename) => {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const download = () => {
    const front = frontRef.current;
    const back = backRef.current;
    front.toBlob((blob) => {
      saveAs(blob, `身份证${cardInfo.name}正面.png`);
    });
    back.toBlob((blob) => {
      saveAs(blob, `身份证${cardInfo.name}背面.png`);
    });
  };
  useImperativeHandle(ref, () => ({ download }));
  return (
    <div className="canvas-panel">
      <canvas ref={frontRef} />
      <canvas ref={backRef} />
    </div>
  );
});
export default CanvasPanel;
