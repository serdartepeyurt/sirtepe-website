export interface CommentProvider {
  render(target: HTMLElement): void;
}

export interface ICommentSection {
  provider: CommentProvider;
}
