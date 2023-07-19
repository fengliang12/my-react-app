import { IPainter } from "./typings";
//https://github.com/Kujiale-Mobile/Painter 文档
const CPainter: React.FC<IPainter> = (props) => {
  const {
    palette,
    customStyle,
    scaleRatio = 1,
    widthPixels,
    dirty = false,
    LRU = false,
    dancePalette,
    customActionStyle,
    action,
    disableAction = false,
    clearActionBox = false,
    imgErr,
    imgOk,
    viewUpdate,
    viewClicked,
    touchEnd,
    didShow,
    use2D = false,
  } = props;
  return (
    <>
      {palette && (
        // @ts-ignore
        <painter
          customStyle={customStyle}
          palette={palette}
          scaleRatio={scaleRatio}
          widthPixels={widthPixels}
          dirty={dirty}
          LRU={LRU}
          // dancePalette={dancePalette}
          // customActionStyle={customActionStyle}
          // action={action}
          // disableAction={disableAction}
          // clearActionBox={clearActionBox}
          onImgErr={imgErr}
          bindimgErr
          onImgOK={imgOk}
          bindimgOK
          onViewUpdate={viewUpdate}
          bindviewUpdate
          onViewClicked={viewClicked}
          bindviewClicked
          onTouchEnd={touchEnd}
          bindtouchEnd
          onDidShow={didShow}
          binddidShow
          use2D={use2D}
        />
      )}
    </>
  );
};
export default CPainter;
