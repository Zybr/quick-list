abstract class State {
  public abstract choose(): void

  public abstract edit(): void

  public abstract cancel(): void
}

export default State;
