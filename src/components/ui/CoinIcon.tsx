export function CoinIcon({ size = '1em' }: { size?: string } = {}) {
  return (
    <img
      src="/coin.png"
      srcSet="/coin.png 1x, /coin@2x.png 2x"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      style={{
        display: 'inline-block',
        verticalAlign: '-0.15em',
        marginLeft: 2,
        flexShrink: 0,
        width: size,
        height: size,
      }}
    />
  );
}
