import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, TwitterShareButton, TwitterIcon, EmailShareButton, EmailIcon } from 'react-share';

interface Props {
  url: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareDialog = ({ url, open }: Props) => {
  return <div className="dialog">
    <FacebookShareButton url={url}>
      <FacebookIcon size={24} round />
    </FacebookShareButton>
    <WhatsappShareButton url={url}>
      <WhatsappIcon size={24} round />
    </WhatsappShareButton>
    <TwitterShareButton url={url}>
      <TwitterIcon size={24} round />
    </TwitterShareButton>
    <EmailShareButton url={url}>
      <EmailIcon size={24} />
    </EmailShareButton>
    <style jsx>{`
      .dialog {
        left: -160px;
        width: 160px;
        position: absolute;
        padding: 0 12px;
        gap: 12px;
        height: 100%;
        background-color: rgb(23 37 84);
        display: ${open ? 'flex' : 'none'}
      }
    `}</style>
  </div>
}

export default ShareDialog;
