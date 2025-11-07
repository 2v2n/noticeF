import React, { useRef, useEffect, useCallback } from 'react';
import {
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  Box,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import TitleIcon from '@mui/icons-material/Title';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

/**
 * @component WysiwygEditor (MUI 버전)
 * @description execCommand 기반 초경량 위지윅 에디터
 * - 툴바: 굵게/기울임/밑줄/H2/글머리기호
 * - 스타일은 전부 MUI `sx`로 처리 (Tailwind 사용 안 함)
 * - placeholder는 `:empty:before` 트릭으로 구현
 */
const WysiwygEditor = ({
  value,
  onChange,
  placeholder = '내용을 입력하세요. (Enter content here.)', // [수정]
  minHeight = 250,                                              // [수정]
  disabled = false,                                             // [수정]
}) => {
  const editorRef = useRef(null);

  // 외부 value → 내부 DOM 동기화
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // 입력 시 부모로 HTML 전달
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // execCommand 포맷 적용
  const applyFormat = (command, value = null) => {
    if (disabled) return; // [수정]
    document.execCommand(command, false, value);
    handleInput();
  };

  // 버튼 클릭 시 포커스 잃지 않도록
  const preventBlur = (e) => e.preventDefault(); // [수정]

  // 간단 붙여넣기 필터(허용 태그만 통과)
  const handlePaste = useCallback(
    (e) => {
      if (!editorRef.current) return;

      const html = e.clipboardData.getData('text/html');
      const text = e.clipboardData.getData('text/plain');

      if (!html && !text) return;
      e.preventDefault();

      const ALLOW = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'H2', 'UL', 'LI', 'P', 'BR']); // [수정]
      const sanitize = (raw) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(raw, 'text/html');
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null);
        const toUnwrap = [];
        while (walker.nextNode()) {
          const el = walker.currentNode;
          if (!ALLOW.has(el.tagName)) {
            toUnwrap.push(el);
          }
        }
        toUnwrap.forEach((el) => {
          const parent = el.parentNode;
          while (el.firstChild) parent.insertBefore(el.firstChild, el);
          parent.removeChild(el);
        });
        return doc.body.innerHTML || '';
      };

      const toInsert = html ? sanitize(html) : (text || '').replace(/\n/g, '<br/>');
      document.execCommand('insertHTML', false, toInsert);
      handleInput();
    },
    [handleInput]
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: 'none'
      }}
    >
      {/* 툴바 */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          px: 1,
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Tooltip title="굵게 (Bold)">
          <span>
            <IconButton
              size="small"
              onMouseDown={preventBlur}               // [수정]
              onClick={() => applyFormat('bold')}
              disabled={disabled}
            >
              <FormatBoldIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="기울임 (Italic)">
          <span>
            <IconButton
              size="small"
              onMouseDown={preventBlur}
              onClick={() => applyFormat('italic')}
              disabled={disabled}
            >
              <FormatItalicIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="밑줄 (Underline)">
          <span>
            <IconButton
              size="small"
              onMouseDown={preventBlur}
              onClick={() => applyFormat('underline')}
              disabled={disabled}
            >
              <FormatUnderlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />

        <Tooltip title="제목 (Heading 2)">
          <span>
            <IconButton
              size="small"
              onMouseDown={preventBlur}
              onClick={() => applyFormat('formatBlock', '<h2>')}
              disabled={disabled}
            >
              <TitleIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="목록 (Unordered List)">
          <span>
            <IconButton
              size="small"
              onMouseDown={preventBlur}
              onClick={() => applyFormat('insertUnorderedList')}
              disabled={disabled}
            >
              <FormatListBulletedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* 에디터(컨텐츠) */}
      <Box
        ref={editorRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        sx={{
          minHeight,                                     // [수정]
          px: 2,
          py: 1.5,
          outline: 'none',
          lineHeight: 1.8,
          fontSize: '1rem',
          color: 'text.primary',
          // placeholder
          '&[data-placeholder]:empty:before': {         // [수정]
            content: 'attr(data-placeholder)',
            color: 'text.disabled',
          },
          // 본문 타이포 스타일
          '& h2': {
            fontSize: '1.5rem',
            fontWeight: 600,
            mt: 1.5,
            mb: 1,
          },
          '& ul': {
            listStyleType: 'disc',
            pl: 3,
            my: 0.5,
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
          },
        }}
      />
    </Paper>
  );
};

export default WysiwygEditor;
