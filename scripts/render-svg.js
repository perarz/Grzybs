// Renders an SVG to a square PNG with macOS AppKit (no extra tools needed).
// Usage: osascript -l JavaScript scripts/render-svg.js <input.svg> <output.png> <size>
ObjC.import('AppKit');
function run(argv) {
  const [input, output, sizeText] = argv;
  const size = parseInt(sizeText, 10);
  const image = $.NSImage.alloc.initWithContentsOfFile(input);
  if (!image || image.isNil()) throw new Error('cannot read ' + input);
  const rep =
    $.NSBitmapImageRep.alloc.initWithBitmapDataPlanesPixelsWidePixelsHighBitsPerSampleSamplesPerPixelHasAlphaIsPlanarColorSpaceNameBytesPerRowBitsPerPixel(
      null,
      size,
      size,
      8,
      4,
      true,
      false,
      $.NSDeviceRGBColorSpace,
      0,
      0,
    );
  rep.size = $.NSMakeSize(size, size);
  $.NSGraphicsContext.saveGraphicsState;
  $.NSGraphicsContext.setCurrentContext($.NSGraphicsContext.graphicsContextWithBitmapImageRep(rep));
  image.drawInRectFromRectOperationFraction(
    $.NSMakeRect(0, 0, size, size),
    $.NSZeroRect,
    $.NSCompositingOperationCopy,
    1.0,
  );
  $.NSGraphicsContext.restoreGraphicsState;
  const data = rep.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $());
  data.writeToFileAtomically(output, true);
  return 'ok ' + output;
}
