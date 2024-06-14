import { Collapse } from "antd-mobile";

type Interpretation = EptInterpretationItem & { label: string };

interface EptTypeProps {
  interpretations: Interpretation[];
}

const EptType = ({ interpretations }: EptTypeProps) => {
  return (
    <Collapse accordion>
      {interpretations.map((interpretation) => (
        <Collapse.Panel key={interpretation.type} title={interpretation.label}>
          <div>
            <span className="emphasize">欲望特质</span>：
            {interpretation.desire_trait}
          </div>

          <div>
            <span className="emphasize">基本困思</span>：
            {interpretation.basic_confusion}
          </div>

          <div>
            <span className="emphasize">主要特征</span>：
            {interpretation.main_features}
          </div>

          <div>
            <span className="emphasize">主要特质</span>：
            {interpretation.main_traits}
          </div>

          <div>
            <span className="emphasize">生活风格</span>：
            {interpretation.lifestyle}
          </div>

          <div>
            <span className="emphasize">人际关系</span>：
            {interpretation.relationships}
          </div>

          <div>
            <span className="emphasize">基本恐惧</span>：
            {interpretation.basic_fear}
          </div>

          <div>
            <span className="emphasize">基本欲望</span>：
            {interpretation.basic_desire}
          </div>

          <div>
            <span className="emphasize">主要性格特点</span>：
            {interpretation.characters.map((v) => (
              <div key={v.keyword} className="indent">
                <span className="emphasize">【{v.keyword}】</span>

                {v.description}
              </div>
            ))}
          </div>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default EptType;
