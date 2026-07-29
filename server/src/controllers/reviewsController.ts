import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Review, Asset, User } from "../models";
import { conflict, forbidden, notFound } from "../middleware/error";
import type { CreateReviewInput } from "../validators/assetsValidators";

// ============================================================
// Reviews controllers — nested under /api/assets/:id/reviews
// ============================================================

// ------------------------------------------------------------
// GET /api/assets/:id/reviews
// Public — list all reviews for an asset with author info
// ------------------------------------------------------------
export async function list(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const asset = await Asset.exists({ _id: req.params.id });
    if (!asset) throw notFound("Asset not found.");

    const reviews = await Review.find({ asset: req.params.id })
      .sort({ createdAt: -1 })
      .populate<{ author: { name: string; avatar?: string } }>("author", "name avatar")
      .lean();

    // Aggregate rating summary
    const summary = await Review.aggregate<{
      _id: null;
      average: number;
      count:   number;
    }>([
      { $match: { asset: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $group: {
          _id: null,
          average: { $avg: "$rating" },
          count:   { $sum: 1 },
        },
      },
    ]);

       res.json({
      reviews: reviews.map((r: typeof reviews[number]) => ({
        _id:     String(r._id),
        author:  r.author?.name ?? "Anonymous",
        avatar:  r.author?.avatar,
        rating:  r.rating,
        comment: r.comment,
        date:    r.createdAt,
      })),
      summary: {
        average: summary[0]?.average ? Number(summary[0].average.toFixed(2)) : 0,
        count:   summary[0]?.count   ?? 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// POST /api/assets/:id/reviews
// Auth required — one review per user per asset
// ------------------------------------------------------------
export async function create(
  req: Request<{ id: string }, unknown, CreateReviewInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const asset = await Asset.exists({ _id: req.params.id });
    if (!asset) throw notFound("Asset not found.");

    const existing = await Review.findOne({
      asset:  req.params.id,
      author: req.user!.sub,
    });
    if (existing) throw conflict("You've already reviewed this asset.");

    const review = await Review.create({
      asset:   req.params.id,
      author:  req.user!.sub,
      rating:  req.body.rating,
      comment: req.body.comment,
    });

    // Load author for the response so client can render immediately
    const author = await User.findById(req.user!.sub).select("name avatar");

    res.status(201).json({
      review: {
        _id:     String(review._id),
        author:  author?.name ?? "You",
        avatar:  author?.avatar,
        rating:  review.rating,
        comment: review.comment,
        date:    review.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ------------------------------------------------------------
// DELETE /api/assets/:id/reviews/:reviewId
// Auth required — author or admin
// ------------------------------------------------------------
export async function remove(
  req: Request<{ id: string; reviewId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const review = await Review.findOne({
      _id:   req.params.reviewId,
      asset: req.params.id,
    });
    if (!review) throw notFound("Review not found.");

    const isAuthor = String(review.author) === req.user!.sub;
    const isAdmin  = req.user!.role === "admin";
    if (!isAuthor && !isAdmin) throw forbidden("You cannot delete this review.");

    await review.deleteOne();
    res.json({ message: "Review deleted.", id: req.params.reviewId });
  } catch (err) {
    next(err);
  }
}