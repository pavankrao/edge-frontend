import React, { useEffect, useState } from 'react';
import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Text,
  TextVariants,
  Grid,
  GridItem,
  ClipboardCopy,
} from '@patternfly/react-core';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { distributionMapper } from './constants';
import PropTypes from 'prop-types';

const ImageDetailTab = ({ imageData, imageVersion }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    imageVersion
      ? setData(imageVersion)
      : setData(
          imageData?.data?.Data?.images?.[
            imageData?.data?.Data?.images?.length - 1
          ]
        );
  }, [imageData, imageVersion]);

  const dateFormat = () => <DateFormat date={data?.image?.['CreatedAt']} />;

  const detailsMapper = {
    'Image name': 'Name',
    Version: 'Version',
    Created: () => dateFormat(),
    'Type(s)': () =>
      data?.image?.['OutputTypes']?.map((outputType, index) => (
        <div key={index}>{outputType}</div>
      )),
    Release: () => distributionMapper?.[data?.image?.['Distribution']],
    //Size: 'Size',
    Description: 'Description',
  };

  const userInfoMapper = {
    Username: () => data?.image?.Installer?.Username,
    'SSH Key': () => data?.image?.Installer?.SshKey,
  };

  const packageMapper = {
    'Total Additional Packages': () => data?.aditional_packages,
    'Total Packages': () => data?.packages,
  };

  const packageDiffMapper = {
    Added: () => data?.update_added,
    Removed: () => data?.update_removed,
    Updated: () => data?.update_updated,
  };

  if (data?.Installer?.Checksum) {
    detailsMapper['SHA-256 Checksum'] = () => data?.image?.Installer?.Checksum;
  }

  const buildTextList = (labelsToValueMapper) =>
    data
      ? Object.entries(labelsToValueMapper).map(([label, value]) => {
          return (
            <>
              <TextListItem
                className="details-label"
                component={TextListItemVariants.dt}
              >
                {label}
              </TextListItem>
              {label === 'SHA-256 Checksum' ||
              (label === 'SSH Key' && value()) ? (
                <ClipboardCopy
                  hoverTip="Copy"
                  clickTip="Copied"
                  variant="inline-compact"
                >
                  <TextListItem component={TextListItemVariants.dd}>
                    {typeof value === 'function'
                      ? value() || 'Unavailable'
                      : data?.image?.[value] || 'Unavailable'}
                  </TextListItem>
                </ClipboardCopy>
              ) : (
                <TextListItem
                  className="pf-u-text-break-word"
                  component={TextListItemVariants.dd}
                >
                  {typeof value === 'function'
                    ? value() === 0
                      ? 0
                      : value() || 'Unavailable'
                    : data?.image?.[value] || 'Unavailable'}
                </TextListItem>
              )}
            </>
          );
        })
      : null;

  return (
    <TextContent className="pf-u-ml-lg pf-u-mt-md">
      <Grid span={12}>
        <GridItem span={6}>
          <Text component={TextVariants.h2}>
            {imageVersion ? 'Details' : 'Most recent image'}
          </Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(detailsMapper)}
          </TextList>
          <Text component={TextVariants.h2}>User Information </Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(userInfoMapper)}
          </TextList>
        </GridItem>
        <GridItem span={6}>
          <Text component={TextVariants.h2}>Packages </Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(packageMapper)}
          </TextList>
          <Text component={TextVariants.h2}>Changes from previous version</Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(packageDiffMapper)}
          </TextList>
        </GridItem>
      </Grid>
    </TextContent>
  );
};

ImageDetailTab.propTypes = {
  imageData: PropTypes.object,
  imageVersion: PropTypes.object,
};

export default ImageDetailTab;
