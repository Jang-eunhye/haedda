import { Platform } from 'react-native';

/** 모달 닫힘 애니메이션(fade)이 끝날 때까지 기다리는 시간 */
const IOS_MODAL_DISMISS_DELAY = 350;

/**
 * 모달 하나를 닫고 곧바로 다른 모달을 열 때 쓴다.
 * iOS는 앞 모달이 닫히는 중에 새 모달을 띄우면 새 모달이 아예 안 뜰 수 있어서,
 * 닫힘 애니메이션이 끝난 뒤에 연다. 안드로이드는 바로 연다.
 */
export function afterModalClose(open: () => void) {
  if (Platform.OS === 'ios') {
    setTimeout(open, IOS_MODAL_DISMISS_DELAY);
  } else {
    open();
  }
}
